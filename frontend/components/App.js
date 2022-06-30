import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import axios from 'axios';
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axiosWithAuth from '../axios';

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  const navigate = useNavigate()
  const redirectToLogin = () =>  navigate('/');
  const redirectToArticles = () =>  navigate('/articles');

  const logout = () => {
    window.localStorage.removeItem('token')
    setMessage('GoodBye!');
    redirectToLogin();
  }

  const login = ({ username, password }) => {
    setMessage('');
    setSpinnerOn(true);
      axios.post(loginUrl, { username, password })
        .then(res => {
          const { token, message } = res.data;
          window.localStorage.setItem('token', token);
          setMessage(message);
          redirectToArticles();
        })
        .catch(err => {
          const { message } = err.response.data;
          setMessage(message);
        })
        .finally(() => setSpinnerOn(false))
  }

  const getArticles = () => {
    setMessage('');
    setSpinnerOn(true);
    axiosWithAuth().get(articlesUrl)
      .then(res => {
        setArticles(res.data.articles);
        setMessage(res.data.message);
      })
      .catch(err => {
        setMessage(err.response.data.message);
        if (err.response.status === 401) {
          redirectToLogin();
        }
      })
      .finally(() => setSpinnerOn(false))
  }

  const postArticle = article => {
    setMessage('');
    setSpinnerOn(true);
    axiosWithAuth().post(articlesUrl, article)
      .then(res => {
        setMessage(res.data.message);
        setArticles(articles.concat(res.data.article))
        setCurrentArticleId();
      })
      .catch(err => {
        setMessage(err.response.data.message);
        if (err.response.status === 401) {
          redirectToLogin();
        }
      })
      .finally(() => setSpinnerOn(false))
  }

  const updateArticle = ( article ) => {
    const { article_id, ...values } = article;
    setMessage('');
    setSpinnerOn(true);
    axiosWithAuth().put(`${articlesUrl}/${article_id}`, values)
      .then(res => {
        setMessage(res.data.message);
        setArticles(articles.map(art => {
          return art.article_id === article_id ? res.data.article : art;
        }));
        setCurrentArticleId();
      })
      .catch(err => {
        setMessage(err.response.data.message);
        if (err.response.status === 401) {
          redirectToLogin();
        }
      })
      .finally(() => setSpinnerOn(false))
  }

  const deleteArticle = article_id => {
    setMessage('');
    setSpinnerOn(true);
    axiosWithAuth().delete(`${articlesUrl}/${article_id}`)
      .then(res => {
        setMessage(res.data.message);
        setArticles(articles.filter(art => art.article_id !== article_id));
      })
      .catch(err => {
        setMessage(err.response.data.message);
        if (err.response.status === 401) {
          redirectToLogin();
        }
      })
      .finally(()=>setSpinnerOn(false))
  }

  return (
    <>
      <Spinner on={spinnerOn}/>
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}>
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login}/>} />
          <Route path="articles" element={
            <>
              <ArticleForm 
                postArticle={postArticle}
                updateArticle={updateArticle}
                setCurrentArticleId={setCurrentArticleId}
                currentArticle={articles.find(art => art.article_id === currentArticleId)}
              />
              <Articles 
                getArticles={getArticles} 
                articles={articles}
                currentArticleId={currentArticleId}
                setCurrentArticleId={setCurrentArticleId}
                deleteArticle={deleteArticle}
              />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
