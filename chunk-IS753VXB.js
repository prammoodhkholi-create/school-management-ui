import{Q as d}from"./chunk-LI3HLH7G.js";var p=class l{downloadCsv(e,t,r){let a=t.map(n=>this.escapeCsv(n.label)).join(","),i=e.map(n=>t.map(s=>{let c=n[s.field]??"",m=Array.isArray(c)?c.join("; "):String(c);return this.escapeCsv(m)}).join(",")),o=[a,...i].join(`
`);this.triggerDownload("\uFEFF"+o,r+".csv","text/csv;charset=utf-8;")}printTable(e,t,r){let a=t.map(s=>`<th>${this.escapeHtml(s)}</th>`).join(""),i=r.map(s=>`<tr>${s.map(c=>`<td>${this.escapeHtml(c??"")}</td>`).join("")}</tr>`).join(""),o=`<!DOCTYPE html>
<html><head>
  <meta charset="UTF-8">
  <title>${this.escapeHtml(e)}</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 11px; margin: 20px; }
    h2 { font-size: 14px; margin-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #ccc; padding: 5px 8px; text-align: left; }
    th { background: #f0f0f0; font-weight: bold; }
    tr:nth-child(even) { background: #fafafa; }
    @media print { body { margin: 0; } }
  </style>
</head><body>
  <h2>${this.escapeHtml(e)}</h2>
  <table>
    <thead><tr>${a}</tr></thead>
    <tbody>${i}</tbody>
  </table>
</body></html>`,n=window.open("","_blank","width=900,height=700");n&&(n.document.write(o),n.document.close(),n.focus(),setTimeout(()=>{n.print(),n.close()},500))}escapeCsv(e){let t=String(e);return t.includes(",")||t.includes('"')||t.includes(`
`)?'"'+t.replace(/"/g,'""')+'"':t}escapeHtml(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}triggerDownload(e,t,r){let a=new Blob([e],{type:r}),i=URL.createObjectURL(a),o=document.createElement("a");o.href=i,o.download=t,document.body.appendChild(o),o.click(),document.body.removeChild(o),URL.revokeObjectURL(i)}static \u0275fac=function(t){return new(t||l)};static \u0275prov=d({token:l,factory:l.\u0275fac,providedIn:"root"})};export{p as a};
