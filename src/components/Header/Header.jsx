import './Header.scss';
import logo from '../../assets/Logo.svg';
import '../../style/buttons.scss';

const Header = () => {
  return (
    <header className="header">
        <div className="container">
            <div className="header__logo">
                <img width={104} height={26} src={logo} alt="logo" />
            </div>
            <div className="header__buttons">
                <button className='button-yellow'>
                    User
                </button>
                <button className='button-yellow'>
                    Sing up
                </button>
            </div>
        </div>
    </header>
  )
}
export default Header