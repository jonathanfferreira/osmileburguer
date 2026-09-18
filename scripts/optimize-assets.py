"""Deterministic photo compression and faithful alpha extraction of the supplied logo.
Run with Pillow. Original source photographs remain untouched in source-assets.
"""
from pathlib import Path
from collections import deque
from PIL import Image, ImageFilter, ImageOps
import json
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'dist' / 'assets'
photos = {'gargalhada':'gargalhada.png','smile-salad':'smile salad.png','smile-bacon':'smile bacon.png','cheese-burger':'cheese burguer.png','smile-calabresa':'smile calabresa.png','chorriso-melt':'chorriso melt.png','rachando-o-bico':'rachando o bico.png','rindo-sozinho':'rindo sozinho.png','sorriso-a-dois':'sorriso a dois.png'}
(OUT/'photos').mkdir(parents=True, exist_ok=True)
(OUT/'brand').mkdir(parents=True, exist_ok=True)
manifest={}
for slug,filename in photos.items():
    source=ROOT/'source-assets'/filename
    im=ImageOps.exif_transpose(Image.open(source)).convert('RGB')
    widths=sorted(set([320,min(640,im.width),im.width]))
    files=[]
    for width in widths:
        resized=im.resize((width,round(im.height*width/im.width)),Image.Resampling.LANCZOS)
        path=OUT/'photos'/f'{slug}-{width}.webp'
        resized.save(path,'WEBP',quality=86,method=6)
        files.append({'file':str(path.relative_to(ROOT/'dist')).replace('\\','/'),'width':width,'bytes':path.stat().st_size})
    manifest[slug]={'width':im.width,'height':im.height,'sourceBytes':source.stat().st_size,'variants':files}
# Remove only the background connected to the canvas perimeter; retain enclosed yellow lettering.
logo=Image.open(ROOT/'source-assets'/'logo insta.jpg').convert('RGBA')
pix=logo.load(); w,h=logo.size; bg=pix[0,0][:3]
seen=bytearray(w*h); queue=deque([(0,0)]); seen[0]=1
while queue:
    x,y=queue.popleft()
    for nx,ny in ((x-1,y),(x+1,y),(x,y-1),(x,y+1)):
        if not(0<=nx<w and 0<=ny<h): continue
        idx=ny*w+nx
        if seen[idx]: continue
        color=pix[nx,ny][:3]
        if sum((color[i]-bg[i])**2 for i in range(3))<10000:
            seen[idx]=1;queue.append((nx,ny))
alpha=Image.new('L',(w,h)); alpha.putdata([0 if value else 255 for value in seen])
logo.putalpha(alpha)
box=alpha.getbbox(); logo=logo.crop(box)
logo.save(OUT/'brand'/'logo.webp','WEBP',lossless=True,method=6)
logo.save(OUT/'brand'/'logo.png')
# Isolate the existing smiley emblem, preserving its source pixels (no tracing/redrawing).
mark=logo.crop((0,0,110,157))
for size,name in [(32,'favicon-32.png'),(180,'apple-touch-icon.png'),(192,'icon-192.png')]:
    icon=Image.new('RGBA',(size,size),(*bg,255)); thumb=mark.copy();thumb.thumbnail((int(size*.79),int(size*.84)),Image.Resampling.LANCZOS)
    icon.alpha_composite(thumb,((size-thumb.width)//2,(size-thumb.height)//2));icon.convert('RGB').save(OUT/'brand'/name)
manifest['logo']={'width':logo.width,'height':logo.height,'crop':box}
(OUT/'image-manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
original=sum(v['sourceBytes'] for k,v in manifest.items() if k!='logo')
optimized=sum(v['variants'][-1]['bytes'] for k,v in manifest.items() if k!='logo')
print(json.dumps({'original_photo_bytes':original,'optimized_photo_bytes':optimized,'reduction_percent':round((1-optimized/original)*100,1),'logo_size':logo.size,'photo_dimensions':{k:[v['width'],v['height']] for k,v in manifest.items() if k!='logo'}}))
