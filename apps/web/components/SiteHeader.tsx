'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
const links = [{href:'/',label:'Home'},{href:'/about',label:'About'},{href:'/packages',label:'Packages'},{href:'/hajj-umrah',label:'Hajj & Umrah'},{href:'/contact',label:'Contact'}];
export default function SiteHeader(){ const [open,setOpen]=useState(false); return <header className="site-header"><div className="container nav-wrap"><Link href="/" className="brand"><Image src="/brand/skyray-logo.png" alt="SkyRay Holidays" width={72} height={64} style={{ width: 'auto', height: '62px', objectFit: 'contain' }} priority/><span>Explore. Plan. Travel.</span></Link><nav className={open?'nav-links open':'nav-links'}>{links.map(x=><Link key={x.href} href={x.href} onClick={()=>setOpen(false)}>{x.label}</Link>)}</nav><Link className="btn btn-primary nav-cta" href="/enquire">Enquire Now <ArrowUpRight size={16}/></Link><button className="menu-toggle" aria-label="Toggle menu" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></div></header> }
