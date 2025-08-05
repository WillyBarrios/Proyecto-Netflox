import './Footer.css';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
let link = '';



const Footer = () => (
    <footer className="footer">
        <>
            <div className='container'>
                <div className='box-redes-sociales'>
                    <h2></h2>
                    <a href={link} className='social'><FaFacebookF className='icono' /><p></p></a>
                    <a href={link} className='social'><FaTwitter className='icono' /><p></p></a>
                    <a href={link} className='social'><FaInstagram className='icono' /><p></p></a>
                    <a href={link} className='social'><FaYoutube className='icono' /><p></p></a>
                    
                    <br></br>
                   </div>
                    <div className="Terminos"  >
                        <p>Avisos legales</p>
                        <p>Términos de uso</p>
                        <p>contáctanos: 1 (866) 916-3579 (USA) </p>

                    </div>
                </div>
        </>
    </footer>
);



export default Footer;