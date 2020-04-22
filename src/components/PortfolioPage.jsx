import React, { Component,Fragment } from "react";
// import DeleteIcon from "@material-ui/icons/Delete";
// import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import EachPortfolio from './EachPortfolio'

import AddPortfolio from './AddPortfolio'

class PortfolioPage extends Component {
  state = {
    posts: [],
    patchpost: [],
    patchpostId: [],
    modifyIsOpen: false,
  }

  componentDidMount() {
    this.loadPost(this.props.token)
  }

  handleChange = (event) => {
    // console.log(event.target.value)
    this.setState({
      patchpost: event.target.value
    })
  }
  
  loadPost = (token) => {
    fetch('http://localhost:8080/portfolio', {
      method: "GET",
      headers: {
        Authorization: 'Bearer ' + token
      }
    }).then(res => {
      if (res.status !== 200) {
        throw new Error('Failed to fetch')
      }
      return res.json()
    }).then(resData => {
      this.setState({
        posts: resData.successMessage.data
      })
    }).catch(err => {
      console.log(err)
    })
  }

  loadPatchPost = (urlId) => {
    fetch('http://localhost:8080/surl/patch/' + urlId, {
      method: "GET"
    }).then(res => {
      return res.json()
    }).then(resData => {
      this.setState({
        patchpost: resData.url_name,
        patchpostId: urlId,
        modifyIsOpen: true,
      })
    }).catch(err => {
      console.log(err)
    })
  }

  deletePostHandler(urlId) {
    // console.log(this.props.token)
    fetch('http://localhost:8080/surl/' + urlId, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + this.props.token
      }
    }).then((res) => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Deleting a post failed!')
      }
      return res.json()
    }).then(resData => {
      this.loadPost(this.props.token)
    }).catch((err) => {
      console.log(err)
    });
  }

  editPostHandler(event, urlId) {
    event.preventDefault()
    fetch('http://localhost:8080/surl/' + urlId, {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer ' + this.props.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url_name: this.state.patchpost
      })
    }).then((res) => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Deleting a post failed!')
      }
      return res.json()
    }).then((resData) => {
      this.loadPost(this.props.token)
      this.setState({
        modifyIsOpen: !this.state.modifyIsOpen
      })
    }).catch(err => {
      console.log(err)
    })
  }

  render() {
    return (
      <Fragment>
        <AddPortfolio token={this.props.token} />
        {this.state.modifyIsOpen &&
          <form onSubmit={(e) => this.editPostHandler(e, this.state.patchpostId)}>
            <label>The url you want to modify</label>
            <input
              name="url"
              value={this.state.patchpost}
              onChange={this.handleChange} />
            <button ><CheckIcon /></button>
          </form>
        }
        {this.state.posts.map(element => (
          <EachPortfolio element={element} />
        ))}
      </Fragment >
    );
  }
}
// <button onClick={() => this.deletePostHandler(element._id)}> <DeleteIcon /></button>
// <button onClick={() => this.loadPatchPost(element._id)}> <EditIcon /></button>
export default PortfolioPage;
