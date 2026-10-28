import sys,re,html
p=sys.argv[1]
s=open(p,encoding='utf-8',errors='ignore').read()
s=re.sub(r'(?is)<(script|style|svg|noscript)[^>]*>.*?</\1>',' ',s)
s=re.sub(r'(?s)<[^>]+>',' ',s)
s=html.unescape(s)
s=re.sub(r'[ \t\r\f\v]+',' ',s)
s=re.sub(r'\n\s*\n+','\n',s)
print(s.strip())
