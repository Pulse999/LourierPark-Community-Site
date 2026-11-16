import { ArrowUpRight, Instagram, Facebook } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Footer() {
  return <footer className="footer">
    <div className="footer-top">
      <div className="footer-brand"><span className="footer-mark">L<span>.</span></span><h2>LOURierPARK</h2><p>Our Neighbourhood, Our Home.</p><span className="footer-location">BLOEMFONTEIN · FREE STATE · SOUTH AFRICA</span></div>
      <div className="footer-column"><span>DISCOVER</span><Link to="/about">About LourierPark</Link><Link to="/explore">Explore the area</Link><Link to="/community">Community</Link></div>
      <div className="footer-column"><span>GET INVOLVED</span><Link to="/contact">Share a suggestion</Link><Link to="/contact">Submit an event</Link><Link to="/contact">General enquiries</Link></div>
      <div className="footer-message"><p>A neighbourhood is made by the people who call it home.</p><Link to="/contact">Be part of the story <ArrowUpRight size={16} /></Link></div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} LourierPark. Community platform.</span><span className="footer-disclaimer">An independent community initiative.</span><div className="socials"><a href="https://www.facebook.com/" aria-label="Facebook"><Facebook size={16}/></a><a href="https://www.instagram.com/" aria-label="Instagram"><Instagram size={16}/></a></div></div>
  </footer>
}