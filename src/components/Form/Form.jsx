import { useEffect, useMemo, useState } from 'react';
import { useHttp } from '../../hooks/http.hook';
import { setContent } from '../../utils/setContent';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import successImage from '../../assets/success-image.svg';
import { SUPPORTED_FORMATS } from '../../utils/validFiles';
import { emailPattern } from '../../utils/emailPattern';
import { truncate } from '../../utils/truncate';

import './Form.scss';

const schema = yup.object({
  name: yup.string().required().min(2).max(60),
  email: yup.string().matches(emailPattern).required().min(2).max(100),
  phone: yup.string().matches(/^[+]{0,1}380([0-9]{9})$/).required(),
  position_id: yup.number().required().positive().integer(),
  photo: yup.mixed()
      .nullable()
      .required('A file is required')
      .test('Fichier taille',
        'upload file', (value) => !value || (value[0] && value[0].size <= 5000 * 1024 * 1024))
      .test('format',
        'upload file', (value) => !value || (value && SUPPORTED_FORMATS.includes(value[0]?.type))),
}).required();

const Form = () => {
  const [positions, setPositions] = useState([]);
  const [fileName, setFileName] = useState('Upload your photo');
  const [suceess, setSuceess] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
      resolver: yupResolver(schema)
  });
  const {request, process, setProcess} = useHttp();

  const onSubmit = async data => { 
    const token = await getToken();
    
    const formData = new FormData();
    data.photo = data.photo[0];
    Object.keys(data).forEach(key => formData.append(key, data[key]));

    const res = await fetch(`https://frontend-test-assignment-api.abz.agency/api/v1/users`, {
      method: 'POST',
      body: formData,
      headers: {
    	'Token': token
      }
    }).then( () => {
      setSuceess(true)
    }).catch((error) => {
      console.log(error);
    });

    return res;
  }

  const getToken = async () => {
    const responsive = await request(`https://frontend-test-assignment-api.abz.agency/api/v1/token`);
    return responsive?.token;
  }

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
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItems = (items) => {

    return items.map( item => {
      const {id, name} = item;

      return (
        <div key={id} className="radio">
          <input type="radio" value={id} name="position" {...register('position_id')} id={id} />
          <label htmlFor={id} className="radio-label">{name}</label>
        </div>
      )
    })
  }

  const positionsEl = useMemo( () => {
		return setContent(process, () => renderItems(positions))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [process]);

  return suceess ? 
  (
    <div className="success">
      <h2 className='form__title'>User successfully registered</h2>
      <img src={successImage} alt="" />
    </div>
  ) 
  :
  ( 
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
        <h3 className={`select__title ${errors.position_id?.message ? 'error' : ''}`}>Select your position</h3>
        <div className="select__container">
            {positionsEl}
        </div>

      </div>

      <div className={`select__upload ${errors.photo?.message && 'error'}`}>
        <div className="upload__wrapper" data-text={truncate(fileName, 20)}>
            <input
              {...register("photo")}  
              onChange={ event => {
                setFileName(event.target.files[0].name)
              }} 
              type="file" 
            />
        </div>
         {errors.photo?.message && <span className='error'>This file is not valided</span>}
      </div>

      <div className="select__btn">
        <button type="submit" className="button-yellow">Sign up</button>
      </div>
    </form>
  </div>
  )
}
export default Form