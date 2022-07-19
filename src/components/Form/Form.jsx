import { useEffect, useMemo, useState } from 'react';
import { useHttp } from '../../hooks/http.hook';
import { setContent } from '../../utils/setContent';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import './Form.scss';

const schema = yup.object({
  name: yup.string().required().min(2).max(60),
  email: yup.string().email().required().min(2).max(100),
  phone: yup.string().matches(/^[\+]{0,1}380([0-9]{9})$/).required(),
  position_id: yup.number().required().positive().integer()
}).required();

const Form = () => {
  const [positions, setPositions] = useState([]);
  const { register, handleSubmit, formState: { errors } } = useForm({
      resolver: yupResolver(schema)
  });
  const {request, process, setProcess} = useHttp();

  const onSubmit = data => console.log(data);

  const getPositions = async () => {
    const responsive = await request(`https://frontend-test-assignment-api.abz.agency/api/v1/positions`);
    return responsive?.positions;
  }

  useEffect( () => {
    getPositions()
    .then(res => {
      setPositions(res);
    })
    .then(() => setProcess('confirmed'));
  }, []);

  const renderItems = (items) => {

    return items.map( item => {
      const {id, name} = item;

      return (
        <div key={id} className="radio">
          <input type="radio" name="position" {...register('position_id', { required: true })} id={id} />
          <label htmlFor={id} className="radio-label">{name}</label>
        </div>
      )
    })
  }

  const positionsEl = useMemo( () => {
		return setContent(process, () => renderItems(positions))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [process]);

  return (
  <div className="form">
    <h2 className="form__title container">Working with POST request</h2>
    <form className='form__container' onSubmit={handleSubmit(onSubmit)}>
      
      <div className={`input__group ${errors.name?.message ? 'error' : ''}`}>
				<label className="input__underlined">
				  <input className='text' {...register("name")} placeholder="&nbsp;"/>
				  <span className="input__label">Your name</span>
					<span className={`input__helper ${errors.name?.message && 'error'}`}>Error text</span>
				</label>
			</div>

      <div className={`input__group ${errors.email?.message ? 'error' : ''}`}>
				<label className="input__underlined">
				  <input type='text' {...register("email")} placeholder="&nbsp;"/>
				  <span className="input__label">Email</span>
					<span className="input__helper">Error text</span>
				</label>
			</div>

      <div className={`input__group ${errors.phone?.message ? 'error' : ''}`}>
				<label className="input__underlined">
				  <input type='text' {...register("phone")}  placeholder="&nbsp;" />
				  <span className="input__label">Phone</span>
					<span className="input__helper">Error text</span>
				</label>
			</div>

      <div className="select">
        <h3 className="select__title">Select your position</h3>
        <div className="select__container">
            {positionsEl}
        </div>

      </div>

      <div className="select__upload">
        <div className="upload__wrapper" data-text="Upload your photo">
            <input type="file" />
        </div>
      </div>

      <div className="select__btn">
        <button type="submit" className="button-yellow">Sign up</button>
      </div>
    </form>
  </div>
  )
}
export default Form