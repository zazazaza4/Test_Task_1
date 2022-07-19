import './Cart.scss';
import photo  from '../../assets/photo-cover.svg'

const Cart = ({name, position, email, phone, photo}) => {
  
  const truncate = (str, n = 30) => str.length > n ?  str.substr(0, n-1) + '...' : str;

  return (
    <article className='cart'>
        <div className="cart__content">
            <div className="cart__image">
                <img src={photo} alt="" className="" />
            </div>
            <p className='cart__name cart__text'>
              <span>{name}</span>
              {truncate(name)}
            </p>
            <div className="cart__info">
                <p className="cart__text">
                  <span>{position}</span>
                  {truncate(position)}
                </p>
                <p className="cart__text">
                  <span>{email}</span>
                  {truncate(email)}
                </p>
                <p className="cart__text">
                  <span>{phone}</span>
                  {truncate(phone)}
                </p>
            </div>
        </div>
    </article>
  )
}
export default Cart