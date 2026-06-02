"""Merge the CADDIE engraving (logo + "CADDIE companion") from caddie-parts.glb
into the two scale parts of our 34-body caddie_exploded.glb, WITHOUT touching any
part transforms / names. The result is a drop-in replacement: explode.json and the
animation code load it unchanged, but the scales now carry the engraving.

- Our model (caddie_exploded.glb): 34 parts p00..p33, has POSITION+NORMAL+indices.
  p05 = front scale (z>0), p04 = back scale (z<0).
- caddie-parts.glb: 372 connected components of the same product, recentered, no
  normals. The engraving lives on the two outer scale faces.

Engraving components are isolated by: on an outer face (|z_center|>11mm), flat
(smallest bbox dim <1.0mm), small footprint (largest dim <15mm), real geometry
(>4 triangles). Verified visually to capture exactly the logo + text, nothing else.
"""
import struct, json, numpy as np

OURS  = "public/models/caddie_exploded.glb"
PARTS = "public/caddie-parts.glb"
OUT   = "public/models/caddie_exploded_engraved.glb"

def load(fn):
    d = open(fn, "rb").read()
    clen, = struct.unpack("<I", d[12:16])
    js = json.loads(d[20:20+clen])
    return js, d[20+clen+8:]

def acc(js, binc, ai):
    a = js["accessors"][ai]; bv = js["bufferViews"][a["bufferView"]]
    off = bv.get("byteOffset", 0) + a.get("byteOffset", 0)
    n = {"VEC3": 3, "VEC2": 2, "SCALAR": 1}[a["type"]]
    ct = {5126: np.float32, 5125: np.uint32, 5123: np.uint16}[a["componentType"]]
    arr = np.frombuffer(binc, dtype=ct, count=a["count"]*n, offset=off)
    return arr.reshape(-1, n) if n > 1 else arr

# ---- read our 34 parts verbatim ----
ojs, obin = load(OURS)
parts = []  # (name, V float32 (n,3), N float32 (n,3), I uint32 (m,))
for node in ojs["nodes"]:
    if "mesh" not in node: continue
    prim = ojs["meshes"][node["mesh"]]["primitives"][0]
    V = acc(ojs, obin, prim["attributes"]["POSITION"]).astype(np.float32)
    N = acc(ojs, obin, prim["attributes"]["NORMAL"]).astype(np.float32)
    I = acc(ojs, obin, prim["indices"]).astype(np.uint32)
    parts.append([node["name"], V, N, I])
names = [p[0] for p in parts]
print("our parts:", names)

# ---- align the fanning tools to a consistent tilt when deployed ----
# Each blade was modelled at a slightly different fold angle (divot -4.3deg, knife
# -2.3deg, ...). Rotate each about its hinge end (x-y plane) so hinge->tip matches
# the knife's -2.3deg. Baked into geometry => consistent throughout, no rotation
# during the explode.
# target tilt (deg) per tool; knife/divot/driver share -2.3, bottle opener -1.2
BLADE_TILT = {"p06": -2.3, "p07": -1.2, "p08": -2.3, "p26": -2.3}
def level_blades(targets):
    for nm, deg in targets.items():
        i = names.index(nm); _, V, N, I = parts[i]
        x = V[:, 0]
        h = x < x.min()+0.005; t = x > x.max()-0.005
        hx, hy = V[h, 0].mean(), V[h, 1].mean()
        ang = np.arctan2(V[t, 1].mean()-hy, V[t, 0].mean()-hx)  # current hinge->tip tilt
        corr = np.radians(deg) - ang
        c, s = np.cos(corr), np.sin(corr); R = np.array([[c, -s], [s, c]])
        piv = np.array([hx, hy])
        Vn = V.astype(np.float64).copy(); Nn = N.astype(np.float64).copy()
        Vn[:, :2] = (Vn[:, :2]-piv) @ R.T + piv
        Nn[:, :2] = Nn[:, :2] @ R.T
        parts[i] = [nm, Vn.astype(np.float32), Nn.astype(np.float32), I]
        print(f"  aligned {nm}: was {np.degrees(ang):+.2f}deg -> {deg}")
level_blades(BLADE_TILT)

# ---- split the brush p29 into a steel head + brass bristles ----
# The brush is one solid (a head bar with bristle tufts hanging below). Split it
# by height so only the bristles read brass and the head stays steel, matching
# the real product. Both halves keep p29's spin via explode.json (p36 mirrors it).
BRUSH_SPLIT_Y = 0.011  # metres; faces >= this = head, below = bristles
def split_y(V, N, I, thr):
    I3 = I.reshape(-1, 3)
    cy = V[I3].mean(1)[:, 1]
    def take(mask):
        faces = I3[mask]; used = np.unique(faces)
        return V[used], N[used], np.searchsorted(used, faces).astype(np.uint32)
    return take(cy >= thr), take(cy < thr)

bi = names.index("p29")
_, bV, bN, bI = parts[bi]
(hV, hN, hI), (rV, rN, rI) = split_y(bV, bN, bI, BRUSH_SPLIT_Y)
parts[bi] = ["p29", hV, hN, hI]    # head  -> steel (mat in explode.json)
parts.append(["p36", rV, rN, rI])  # bristles -> brass
print(f"split brush p29 -> head {len(hV)}v / bristles(p36) {len(rV)}v")

# The source brush solid ends at x~34mm but its hinge/spinner is at x~50mm, so the
# deployed brush hovers with no link. Add a steel connecting tang (p37) that bridges
# the head end to the spinner; it carries p29's pivot/spin so it swings with the brush.
def make_box(x0, x1, y0, y1, z0, z1):
    c = np.array([[x0,y0,z0],[x1,y0,z0],[x1,y1,z0],[x0,y1,z0],
                  [x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]], np.float64)
    faces = [(0,3,2,1,[0,0,-1]),(4,5,6,7,[0,0,1]),(0,4,7,3,[-1,0,0]),
             (1,2,6,5,[1,0,0]),(0,1,5,4,[0,-1,0]),(3,7,6,2,[0,1,0])]
    V=[];N=[];I=[];b=0
    for a,bb,cc,d,nrm in faces:
        V += [c[a],c[bb],c[cc],c[d]]; N += [nrm]*4
        I += [[b,b+1,b+2],[b,b+2,b+3]]; b += 4
    return (np.array(V,np.float32), np.array(N,np.float32),
            np.array(I,np.uint32).reshape(-1))
# Full-cross-section carrier plate (matches the brush head y/z) running from the
# head end into the spinner, so head+plate read as ONE continuous steel carrier.
tV, tN, tI = make_box(0.0330, 0.0520, 0.0100, 0.0170, -0.0040, 0.0040)
parts.append(["p37", tV, tN, tI])  # connecting carrier plate -> steel
print("added brush connecting carrier plate p37")

# ---- frame alignment (caddie-parts -> our frame), pure translation ----
pjs, pbin = load(PARTS)
allP = []; comps = []
for node in pjs["nodes"]:
    if "mesh" not in node: continue
    prim = pjs["meshes"][node["mesh"]]["primitives"][0]
    P = acc(pjs, pbin, prim["attributes"]["POSITION"]).astype(np.float64)
    I = acc(pjs, pbin, prim["indices"]).astype(np.uint32).reshape(-1, 3)
    comps.append((P, I)); allP.append(P)
allP_cat = np.concatenate(allP)
allO = np.concatenate([p[1].astype(np.float64) for p in parts])
# bbox-center alignment (both are the same product at identical extent)
shift = (allO.min(0)+allO.max(0))/2 - (allP_cat.min(0)+allP_cat.max(0))/2
print("alignment shift (mm):", np.round(shift*1000, 3))

# ---- isolate engraving components (on outer scale faces) ----
# Candidate strokes: on an outer face, flat, small footprint, real geometry.
cand_front, cand_back = [], []
for P, I in comps:
    bb = P.max(0)-P.min(0); ctr = (P.max(0)+P.min(0))/2
    zc = (ctr[2]+shift[2])*1000
    thin = np.sort(bb)[0]*1000; longd = np.sort(bb)[2]*1000
    if abs(zc) > 11 and thin < 1.2 and longd < 15 and len(I) >= 2:
        Ps = P+shift
        d = dict(P=Ps, I=I, x0=Ps[:,0].min(), x1=Ps[:,0].max(),
                 y0=Ps[:,1].min(), y1=Ps[:,1].max(), area=bb[0]*bb[1],
                 cx=(ctr[0]+shift[0]))
        (cand_front if zc > 0 else cand_back).append(d)

# Drop counter islands: letters like D/O/a/p/e tessellate as a glyph stroke PLUS a
# separate filled island inside the counter. Darkening the island fills the hole, so
# we discard any component whose (x,y) footprint sits inside a larger one — leaving
# open counters that reveal the aluminium beneath.
def open_counter(I):
    # Some glyphs (e.g. the uppercase A) tessellate as a solid fill with the counter
    # closed. Drop interior faces (all three edges shared by another face) so the
    # counter opens to the aluminium beneath — thin strokes (all-boundary) survive.
    from collections import Counter
    ec = Counter()
    for a, b, c in I:
        for e in ((a, b), (b, c), (a, c)):
            ec[tuple(sorted((int(e[0]), int(e[1]))))] += 1
    keep = [f for f in I if any(
        ec[tuple(sorted((int(f[i]), int(f[j]))))] < 2 for i, j in ((0, 1), (1, 2), (0, 2)))]
    return np.array(keep, dtype=np.uint32) if keep else I

def drop_islands(cand):
    m = 0.0002
    def inside(B, A):
        return (B["x0"]-m <= A["x0"] and A["x1"] <= B["x1"]+m and
                B["y0"]-m <= A["y0"] and A["y1"] <= B["y1"]+m)
    keep = [A for A in cand
            if not any(B is not A and B["area"] > A["area"]*1.1 and inside(B, A) for B in cand)]
    out = []
    for c in keep:
        I = open_counter(c["I"]) if c["cx"] > 0 else c["I"]  # cx>0 = text (skip logo)
        out.append((c["P"], np.asarray(I)))
    return out, len(cand)-len(keep)

eng_front, nf = drop_islands(cand_front)
eng_back,  nb = drop_islands(cand_back)
print("engraving strokes: front=%d (dropped %d islands)  back=%d (dropped %d islands)"
      % (len(eng_front), nf, len(eng_back), nb))

def flat_normals(V, I):
    N = np.zeros_like(V)
    fn = np.cross(V[I[:,1]]-V[I[:,0]], V[I[:,2]]-V[I[:,0]])
    for k in range(3):
        np.add.at(N, I[:,k], fn)
    ln = np.linalg.norm(N, axis=1, keepdims=True); ln[ln==0] = 1
    return (N/ln).astype(np.float32)

# Our scales are SOLID plates, so a recessed engraving would be occluded by the
# flat face. Build the engraving as its own part and lift it just PROUD of the
# scale's outer face (0.05mm gap) so it reads as crisp etched branding. It gets
# a dark matte "engrave" material via explode.json and off=[0,0,0] (stays put with
# the scales) — the 34 original parts are untouched, so the animation is identical.
PROUD = 0.00005  # 0.05 mm
def build_engraving(eng, outward):
    Vs, Ns, Is = [], [], []
    base = 0
    for P, Ic in eng:
        Vs.append(P); Ns.append(flat_normals(P, Ic)); Is.append(Ic.reshape(-1)+base)
        base += len(P)
    V = np.concatenate(Vs); N = np.concatenate(Ns); I = np.concatenate(Is)
    # lift so the face nearest the scale sits just outside the scale's outer plane
    if outward > 0:
        face_z = max(p[1][:,2].max() for p in parts if p[0] in ("p04","p05"))
        V[:,2] += (face_z + PROUD) - V[:,2].min()
    else:
        face_z = min(p[1][:,2].min() for p in parts if p[0] in ("p04","p05"))
        V[:,2] += (face_z - PROUD) - V[:,2].max()
    return V.astype(np.float32), N.astype(np.float32), I.astype(np.uint32)

parts.append(["p34", *build_engraving(eng_front, +1)])  # front, camera-facing
parts.append(["p35", *build_engraving(eng_back, -1)])   # back
print("added engraving nodes p34 (%d verts), p35 (%d verts)" % (len(parts[-2][1]), len(parts[-1][1])))

# ---- write GLB (same layout as scripts_build_glb.py) ----
buf = bytearray(); bufferViews = []; accessors = []; gmeshes = []; nodes = []
ARRAY, ELEM = 34962, 34963
def add_view(b, target):
    while len(buf) % 4: buf.append(0)
    off = len(buf); buf.extend(b)
    bufferViews.append({"buffer":0,"byteOffset":off,"byteLength":len(b),"target":target})
    return len(bufferViews)-1
for idx,(name,V,N,I) in enumerate(parts):
    V = V.astype(np.float32); N = N.astype(np.float32); I = I.astype(np.uint32)
    vView = add_view(V.tobytes(), ARRAY); nView = add_view(N.tobytes(), ARRAY); iView = add_view(I.tobytes(), ELEM)
    aPos = len(accessors); accessors.append({"bufferView":vView,"componentType":5126,"count":len(V),"type":"VEC3","min":V.min(0).tolist(),"max":V.max(0).tolist()})
    aNor = len(accessors); accessors.append({"bufferView":nView,"componentType":5126,"count":len(N),"type":"VEC3"})
    aIdx = len(accessors); accessors.append({"bufferView":iView,"componentType":5125,"count":I.size,"type":"SCALAR"})
    gmeshes.append({"primitives":[{"attributes":{"POSITION":aPos,"NORMAL":aNor},"indices":aIdx}]})
    nodes.append({"mesh":idx,"name":name})
gltf = {"asset":{"version":"2.0","generator":"caddie merge_engraving"},
        "scene":0,"scenes":[{"nodes":list(range(len(nodes)))}],
        "nodes":nodes,"meshes":gmeshes,"accessors":accessors,"bufferViews":bufferViews,
        "buffers":[{"byteLength":len(buf)}]}
jb = json.dumps(gltf, separators=(",",":")).encode("utf8")
while len(jb) % 4: jb += b" "
while len(buf) % 4: buf.append(0)
glb = bytearray()
glb += struct.pack("<III", 0x46546C67, 2, 12+8+len(jb)+8+len(buf))
glb += struct.pack("<II", len(jb), 0x4E4F534A); glb += jb
glb += struct.pack("<II", len(buf), 0x004E4942); glb += buf
open(OUT, "wb").write(glb)
print("wrote", OUT, len(glb), "bytes")
