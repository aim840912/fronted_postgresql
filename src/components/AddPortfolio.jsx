import React, { useState } from 'react';

function AddPortfolio(props) {
    const [portfolio, setPortfolio] = useState({
        title: '',
        url: '',
        intro: '',
        photo: []
    })

    function handleChange(event) {
        const { name, value } = event.target
        console.log(event.target)
        setPortfolio(prevPortfolio => {
            return {
                ...prevPortfolio,
                [name]: value
            }
        })
    }

    function imageHandleChange(e) {
        console.log(e.target)
        setPortfolio(prevPortfolio => {
            return {
                ...prevPortfolio,
                photo: e.target.files
            }
        })
    }

    function postHandler(e) {
        console.log(props.token)
        e.preventDefault()
        fetch('http://localhost:8080/portfolio', {
            method: 'POST',
            body: JSON.stringify({
                title: portfolio.title,
                url: portfolio.url,
                intro: portfolio.intro,
                photo: portfolio.photo,
            }),
            headers: {
                Authorization: 'Bearer ' + props.token,
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Creating a post failed!')
            }
            return res.json()
        }).then(resData => {
            setPortfolio({
                title: '',
                intro: '',
                url: '',
                photo: []
            })
        }).catch((err) => {
            console.log(err)
        });
    }

    return (
        <div>
            <form onSubmit={postHandler}>
                <input
                    type="text"
                    name="title"
                    onChange={handleChange}
                    value={portfolio.title}
                    placeholder="Paste your title" />
                <input
                    type="text"
                    name="url"
                    onChange={handleChange}
                    value={portfolio.url}
                    placeholder="Paste your yt-url" />
                <textarea
                    type="text"
                    name="intro"
                    onChange={handleChange}
                    value={portfolio.intro}
                    placeholder="Paste your description" />
                <input
                    type="file"
                    name="myImage"
                    onChange={imageHandleChange} />
                <button >Add</button>
            </form>
        </div >
    )

}
export default AddPortfolio