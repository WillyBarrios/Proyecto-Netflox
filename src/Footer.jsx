import './Footer.css';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const link = '';

const Footer = () => (
    <footer className="footer">
        <div className='footer-container'>
            <div className='social-section'>
                <h4 className='social-title'>Síguenos</h4>
                <div className='box-redes-sociales'>
                    <a href={link} className='social'><FaFacebookF /></a>
                    <a href={link} className='social'><FaTwitter /></a>
                    <a href={link} className='social'><FaInstagram /></a>
                    <a href={link} className='social'><FaYoutube /></a>
                </div>
            </div>
            
            <div className="footer-info">
                <div className="footer-column">
                    <h4>Empresa</h4>
                    <a href="#">Acerca de</a>
                    <a href="#">Empleos</a>
                    <a href="#">Prensa</a>
                </div>
                <div className="footer-column">
                    <h4>Soporte</h4>
                    <a href="#">Centro de ayuda</a>
                    <a href="#">Contáctanos</a>
                    <a href="#">Términos de uso</a>
                </div>
                <div className="footer-column">
                    <h4>Legal</h4>
                    <a href="#">Avisos legales</a>
                    <a href="#">Privacidad</a>
                    <a href="#">Cookies</a>
                </div>
                <div className="footer-column">
                    <h4>Contacto</h4>
                    <p>1 (866) 916-3579 (USA)</p>
                    <p>Servicio al cliente 24/7</p>
                </div>
            </div>
            
            <div className="footer-bottom">
                <p>&copy; 2024 Netflix Clone. Todos los derechos reservados.</p>
            </div>
        </div>
    </footer>
);

export default Footer;
