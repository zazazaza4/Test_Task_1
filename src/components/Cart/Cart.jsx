import { memo } from 'react';
import { truncate } from '../../utils/truncate';
import defaultPhoto  from '../../assets/photo-cover.svg';

import './Cart.scss';

const Cart = memo(({name, position, email, phone, photo}) => {

  return (
    <article className='cart'>
        <div className="cart__content">
            <div className="cart__image">
                <img src={photo && defaultPhoto} alt="" className="" />
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
});

export default Cart