import struct, json, numpy as np
from OCP.STEPControl import STEPControl_Reader
from OCP.TopExp import TopExp_Explorer
from OCP.TopAbs import TopAbs_SOLID, TopAbs_FACE, TopAbs_FORWARD, TopAbs_REVERSED
from OCP.TopoDS import TopoDS
from OCP.BRepMesh import BRepMesh_IncrementalMesh
from OCP.BRep import BRep_Tool
from OCP.TopLoc import TopLoc_Location
from OCP.Bnd import Bnd_Box
from OCP.BRepBndLib import BRepBndLib
from OCP.GProp import GProp_GProps
from OCP.BRepGProp import BRepGProp

STEP = "public/models/Caddie Companion_No.000001_Cad (2).STEP"
OUT  = "public/models/caddie_exploded.glb"
SCALE = 0.001  # mm -> m

r = STEPControl_Reader(); r.ReadFile(STEP); r.TransferRoots()
shape = r.OneShape()
exp = TopExp_Explorer(shape, TopAbs_SOLID)
solids = []
while exp.More():
    solids.append(TopoDS.Solid_s(exp.Current())); exp.Next()
print("solids:", len(solids))

def tessellate(solid):
    b=Bnd_Box(); BRepBndLib.Add_s(solid,b)
    xmin,ymin,zmin,xmax,ymax,zmax=b.Get()
    diag=((xmax-xmin)**2+(ymax-ymin)**2+(zmax-zmin)**2)**0.5
    defl=min(1.4, max(0.18, diag*0.014))  # ~1.4% of size, clamped
    BRepMesh_IncrementalMesh(solid, defl, False, 0.6, True)  # adaptive linear, angular 0.6rad
    V = []; N = []; I = []
    fexp = TopExp_Explorer(solid, TopAbs_FACE)
    while fexp.More():
        face = TopoDS.Face_s(fexp.Current())
        loc = TopLoc_Location()
        tri = BRep_Tool.Triangulation_s(face, loc)
        if tri is None:
            fexp.Next(); continue
        trsf = loc.Transformation()
        nb = tri.NbNodes()
        base = len(V)
        pts = []
        for i in range(1, nb+1):
            p = tri.Node(i).Transformed(trsf)
            pts.append((p.X(), p.Y(), p.Z()))
        pts = np.array(pts, dtype=np.float64)
        vn = np.zeros((nb,3), dtype=np.float64)
        rev = (face.Orientation() == TopAbs_REVERSED)
        tris = []
        for i in range(1, tri.NbTriangles()+1):
            t = tri.Triangle(i)
            a,b,c = t.Get()
            a-=1; b-=1; c-=1
            if rev: b,c = c,b
            tris.append((a,b,c))
            # face normal
            n = np.cross(pts[b]-pts[a], pts[c]-pts[a])
            vn[a]+=n; vn[b]+=n; vn[c]+=n
        # normalize
        ln = np.linalg.norm(vn, axis=1, keepdims=True); ln[ln==0]=1
        vn = vn/ln
        for k in range(nb):
            V.append(pts[k]*SCALE); N.append(vn[k])
        for (a,b,c) in tris:
            I.append((base+a, base+b, base+c))
        fexp.Next()
    return (np.array(V,dtype=np.float32), np.array(N,dtype=np.float32), np.array(I,dtype=np.uint32))

# classify material per solid by geometry -> mat key the canvas understands
def classify(solid):
    b=Bnd_Box(); BRepBndLib.Add_s(solid,b)
    xmin,ymin,zmin,xmax,ymax,zmax=b.Get()
    sx,sy,sz=xmax-xmin,ymax-ymin,zmax-zmin
    c=((xmin+xmax)/2,(ymin+ymax)/2,(zmin+zmax)/2)
    vp=GProp_GProps(); BRepGProp.VolumeProperties_s(solid,vp); vol=vp.Mass()
    dims=sorted([sx,sy,sz])
    thin = dims[0]  # smallest dim
    return dict(size=(sx,sy,sz), c=c, vol=vol, thin=thin)

meshes=[]; metas=[]
for idx,s in enumerate(solids):
    V,N,I = tessellate(s)
    meshes.append((V,N,I))
    metas.append(classify(s))
    print(f"  p{idx:02d}: V={len(V):6d} T={len(I):6d}  vol={metas[idx]['vol']:8.1f} thin={metas[idx]['thin']:5.1f}")

# ---- write GLB ----
buf = bytearray()
bufferViews=[]; accessors=[]; gmeshes=[]; nodes=[]

def add_view(data_bytes, target):
    # align to 4
    while len(buf)%4: buf.append(0)
    off=len(buf); buf.extend(data_bytes)
    bufferViews.append({"buffer":0,"byteOffset":off,"byteLength":len(data_bytes),"target":target})
    return len(bufferViews)-1

ARRAY_BUFFER=34962; ELEMENT_ARRAY_BUFFER=34963
for idx,(V,N,I) in enumerate(meshes):
    vb=V.tobytes(); nb=N.tobytes(); ib=I.tobytes()
    vView=add_view(vb,ARRAY_BUFFER)
    nView=add_view(nb,ARRAY_BUFFER)
    iView=add_view(ib,ELEMENT_ARRAY_BUFFER)
    vmin=V.min(axis=0).tolist(); vmax=V.max(axis=0).tolist()
    aPos=len(accessors); accessors.append({"bufferView":vView,"componentType":5126,"count":len(V),"type":"VEC3","min":vmin,"max":vmax})
    aNor=len(accessors); accessors.append({"bufferView":nView,"componentType":5126,"count":len(N),"type":"VEC3"})
    aIdx=len(accessors); accessors.append({"bufferView":iView,"componentType":5125,"count":I.size,"type":"SCALAR"})
    gmeshes.append({"primitives":[{"attributes":{"POSITION":aPos,"NORMAL":aNor},"indices":aIdx}]})
    nodes.append({"mesh":idx,"name":f"p{idx:02d}"})

gltf={
 "asset":{"version":"2.0","generator":"caddie step_to_glb"},
 "scene":0,"scenes":[{"nodes":list(range(len(nodes)))}],
 "nodes":nodes,"meshes":gmeshes,"accessors":accessors,"bufferViews":bufferViews,
 "buffers":[{"byteLength":len(buf)}],
}
json_bytes=json.dumps(gltf,separators=(',',':')).encode("utf8")
while len(json_bytes)%4: json_bytes+=b' '
while len(buf)%4: buf.append(0)
glb=bytearray()
glb+=struct.pack("<III",0x46546C67,2,12+8+len(json_bytes)+8+len(buf))
glb+=struct.pack("<II",len(json_bytes),0x4E4F534A); glb+=json_bytes
glb+=struct.pack("<II",len(buf),0x004E4942); glb+=buf
open(OUT,"wb").write(glb)
print("\nwrote",OUT,len(glb),"bytes")

# dump metas for the explode-map generator
json.dump([{"id":f"p{i:02d}", **{k:(list(v) if isinstance(v,tuple) else v) for k,v in m.items()}} for i,m in enumerate(metas)],
          open("scripts_metas.json","w"), indent=0)
print("wrote scripts_metas.json")
