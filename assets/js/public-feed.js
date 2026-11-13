/* Public editorial feed: keep existing local articles as fallback and append live published stories. */
(() => {
 const cfg=window.FEBRIA_SUPABASE_CONFIG||{};
 const valid=cfg.url&&cfg.anonKey&&!cfg.url.includes("YOUR-PROJECT")&&!cfg.anonKey.includes("YOUR_SUPABASE");
 if(!valid||!window.supabase){window.FEBRIA_ARTICLES_READY=Promise.resolve(window.FEBRIA_ARTICLES||[]);return;}
 const client=window.supabase.createClient(cfg.url,cfg.anonKey);
 window.FEBRIA_SUPABASE_PUBLIC=client;
 window.FEBRIA_ARTICLES_READY=(async()=>{
  try{
   const {data,error}=await client.from("articles").select("id,title,slug,category,excerpt,content,image_url,source_url,author_name,seo_title,seo_description,published_at,created_at,view_count").eq("status","published").order("published_at",{ascending:false}).limit(100);
   if(error)throw error;
   const local=window.FEBRIA_ARTICLES||[];
   const live=(data||[]).map(a=>({
    id:a.id,slug:a.slug,url:"artikel/baca.html?slug="+encodeURIComponent(a.slug),
    category:a.category,label:({update:"FEBRIA UPDATE",business:"FEBRIA BUSINESS",tech:"FEBRIA TECH",viral:"FEBRIA VIRAL FACT"})[a.category]||"FEBRIA MEDIA",
    date:a.published_at||a.created_at,read:"BERITA TERBIT",title:a.title,excerpt:a.excerpt,
    body:(a.content||"").split(/\n\s*\n/).filter(Boolean),art:a.category==="tech"?"FEBRIA TECH":a.category==="business"?"FEBRIA BUSINESS":a.category==="viral"?"VIRAL FACT":"FEBRIA UPDATE",
    source:a.source_url||"",image:a.image_url,author:a.author_name,seoTitle:a.seo_title,seoDescription:a.seo_description,isLive:true
   }));
   const seen=new Set(live.map(a=>a.slug));
   window.FEBRIA_ARTICLES=[...live,...local.filter(a=>!seen.has(a.id))];
   return window.FEBRIA_ARTICLES;
  }catch(err){console.warn("FEBRIA live feed unavailable; showing editorial fallback.",err);return window.FEBRIA_ARTICLES||[];}
 })();
})();