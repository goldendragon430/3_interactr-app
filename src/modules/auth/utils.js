import axios from 'axios';
import {useState} from 'react';
import {phpApi} from "../../utils/apis";
import {cache} from "../../graphql/client";
import {gql, useReactiveVar} from "@apollo/client";
import {getAcl} from "../../graphql/LocalState/acl";

export const TOKEN = 'auth-token';

export function getToken() {
  return window.localStorage.getItem('auth-token');
}

export function setToken(token) {
  if (token === null) {
    window.localStorage.removeItem(TOKEN);
    return;
  }
  window.localStorage.setItem(TOKEN, token);
}

export async function login({email, password, redirectUrl}) {
    const request = await axios.post(import.meta.env.VITE_API_URL + '/auth/interactr/authenticate', {
      email, password
    })
   setToken(request.data.data.token);

    window.location.href = redirectUrl;
}

export function useLoginAsUser() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const acl = useReactiveVar(getAcl);

  const loginAsUser = ({userId, saveOnStorage}) => {
        setLoading(true);

      const authUser = cache.readFragment({
        id: `User:${acl.authUserId}`,
        fragment: gql`
            fragment UserFragment on User {
                id
                name
            }
        `,
      });

        phpApi(`loginAsUser/${userId}`)
            .then(res => res.json())
            .then(data => {
                if (saveOnStorage) {
                    const storageKey = 'logged_in_sub_user_'+userId;

                    sessionStorage.removeItem(storageKey);
                    sessionStorage.setItem(
                        storageKey,
                        JSON.stringify({parent: {id: authUser.id, name: authUser.name}})
                    );
                }

                setToken(data.token);
                window.location.href = '/'
            })
            .catch((error) => setError(error))
            .finally(() => setLoading(false));
    };

    return [loginAsUser, {loading, error}]
}



export function logout() {
  // Fuck knows why I gota do this here!!
  axios.post(config.BACKEND.API + 'auth/interactr/logout', {}, {
    headers: {
      'Authorization': 'Bearer ' + window.localStorage.getItem('auth-token')
    }
  })
    .then(function (response) {
      window.localStorage.removeItem('auth-token');
      window.location.href = '/login';
    })
    .catch(function (error) {
      console.error({text: 'Error logging you out of the system'})
    });
}
