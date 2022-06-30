import React, { useEffect, useState } from 'react'
import PT from 'prop-types'

const initialFormValues = { title: '', text: '', topic: '' }

export default function ArticleForm(props) {
  const [values, setValues] = useState(initialFormValues)
  const { postArticle, updateArticle, currentArticle, setCurrentArticleId } = props;

  useEffect(() => {
    setValues( currentArticle || initialFormValues)
  },[currentArticle])

  const onChange = evt => {
    const { id, value } = evt.target
    setValues({ ...values, [id]: value })
  }

  
  const reset = (evt) => {
    evt.preventDefault()
    setValues(initialFormValues);
    setCurrentArticleId();
  }

  const onSubmit = evt => {
    evt.preventDefault()
    !currentArticle ? postArticle(values) : updateArticle(values)
    setValues(initialFormValues);
  }

  const isDisabled = () => {
    if (
      values.title.trim().length >= 1
      && values.text.trim().length >= 1
      && values.topic
    ) {
      return false;
    } else {
      return true;
    }
  }

  return (
    <form id="form" onSubmit={onSubmit}>
      <h2>{!currentArticle ? 'Create' : 'Edit'} Article</h2>
      <input
        maxLength={50}
        onChange={onChange}
        value={values.title}
        placeholder="Enter title"
        id="title"
      />
      <textarea
        maxLength={200}
        onChange={onChange}
        value={values.text}
        placeholder="Enter text"
        id="text"
      />
      <select onChange={onChange} id="topic" value={values.topic}>
        <option value="">-- Select topic --</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
      </select>
      <div className="button-group">
        <button disabled={isDisabled()} id="submitArticle">Submit</button>
        {
          currentArticle && <button onClick={reset}>Cancel edit</button>
        }
      </div>
    </form>
  )
}

// 🔥 No touchy: LoginForm expects the following props exactly:
ArticleForm.propTypes = {
  postArticle: PT.func.isRequired,
  updateArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticle: PT.shape({ // can be null or undefined, meaning "create" mode (as opposed to "update")
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })
}
