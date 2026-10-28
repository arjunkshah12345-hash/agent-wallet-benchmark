import json,random,urllib.request,concurrent.futures as cf,collections,sys
d=json.load(open(sys.argv[1]))
random.seed(42)
tools=d['tools']; sample=random.sample(tools,240)
def get(t):
    try:
        with urllib.request.urlopen(urllib.request.Request(t['url'],headers={'User-Agent':'curl/8.7.1'}),timeout=20) as r: return json.load(r)
    except Exception as e: return {"_err":str(e),"id":t['id']}
with cf.ThreadPoolExecutor(12) as ex: res=list(ex.map(get,sample))
keys=collections.Counter(); price=0; reach=collections.Counter(); live=collections.Counter(); errs=0; pricing_examples=[]
for r in res:
    if '_err' in r: errs+=1; continue
    keys.update(r.keys())
    s=json.dumps(r).lower()
    p = r.get('pricing') or r.get('price') or r.get('billing') or r.get('cost')
    if p: price+=1; pricing_examples.append(p) if len(pricing_examples)<3 else None
    reach[(r.get('documentation') or {}).get('upstream',{}).get('reachability')]+=1
    live[str((r.get('verification') or {}).get('liveAccountChecked'))]+=1
print("fetched",len(res)-errs,"errs",errs)
print("top-level keys:",keys.most_common())
print("with pricing field:",price)
print("upstream doc reachability:",reach.most_common())
print("liveAccountChecked:",live.most_common())
print("pricing examples:",json.dumps(pricing_examples)[:800])
json.dump({"n":len(res)-errs,"errs":errs,"with_pricing":price,"reachability":reach.most_common(),"liveAccountChecked":live.most_common()},open(sys.argv[2],'w'),indent=1)
