import { useEffect, useMemo, useState } from "react";
import Cart from "../../components/Cart/Cart";
import Form from "../../components/Form/Form";
import Header from "../../components/Header/Header";
import { useHttp } from "../../hooks/http.hook";
import { setContent } from "../../utils/setContent";

import '../../style/global.scss'
import './Home.scss';

const Home = () => {
  const [users, setUsers] = useState([]);
	const [newItemLoading, setNewItemLoading] = useState(false);
	const [usersEnded, setUsersEnded] = useState(false);
  const [page, setPage] = useState(1);

  const {request, process, setProcess} = useHttp();

  useEffect( () => {
    onRequest(page, true);
  }, []);

  const onRequest = (offset, intial) => {
		intial ? setNewItemLoading(false) : setNewItemLoading(true);
		onGetUsers(offset)
			.then(onUsersLoaded)
			 .then(() => setProcess('confirmed'));
	}

  const onGetUsers = async (page) => {
    const responsive = await request(`https://frontend-test-assignment-api.abz.agency/api/v1/users?page=${page}&count=6`)
    return responsive?.users;
  }

  const onUsersLoaded = (newUsers) => {
		let ended = false;
		if (newUsers.length < 6) {
			ended = true;
		}
		setUsers(users => [...users, ...newUsers]);
		setNewItemLoading(newItemLoading => false);
		setPage(offset => offset + 1);
		setUsersEnded(charactersEnded => ended);
	}

  function renderItems(users) {
    return users.map( item => {
      return <Cart key={item.id} {...item}/>
    }); 
  }

  const elements = useMemo( () => {
		return setContent(process, () => renderItems(users), newItemLoading)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [process]);
  
  return (
    <div>
        <Header/>
        <main className="main">
            <div className="welcome container">
              <div className="welcome__content">
                <div className="welcome__text">
                  <h1 className="welcome__title">
                    Test assignment for front-end developer 
                  </h1>
                  <p className="welcome__disc">
                    What defines a good front-end developer is one that has skilled knowledge of HTML, CSS, JS with a vast understanding of User design thinking as they'll be building web interfaces with accessibility in mind. They should also be excited to learn, as the world of Front-End Development keeps evolving.
                  </p>
                </div>
                <button className="button-yellow">
                  Sing up
                </button>
              </div>
            </div>
            <div className="staff container">
              <h2 className="staff__title">
                Working with GET request
              </h2>
              <div className="staff__carts">
                { elements }
              </div>
              <div className="staff__btn">
                  <button 
                    className="button-yellow"
                    disabled={newItemLoading || process === 'error'}
                    onClick={() => onRequest(page)}
				            style={{ 'display': usersEnded ? 'none' : 'inline' }}
                  >
                    Show more
                  </button>
              </div>
            </div>
            <Form/>
        </main>
    </div>
  )
}
export default Home