import React, {Component} from 'react';
import axios from 'axios';

var loadjs = require('loadjs');

class Category extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: this.props.category,
      categoryExtra: this.props.categoryExtra,
      search: '',
      error: null,
      isLoaded: false,
      posts: []
    };
  } 

  myChangeHandler = (event) => {
    this.setState({search: event.target.value});
  }

  componentDidMount() {

    loadjs('../main.js');
    if(localStorage.getItem('token') !== null) {
      axios({
        method: 'POST',
        url: '../users/authToken',
        headers: {
            "Content-Type": "application/json",
            'token': localStorage.getItem('token')
        }
      }).then((response) => {
        
      }).catch((error) => {
          console.log(error);
      });
    } else {
      localStorage.clear();
    }
    axios({
      method: 'POST',
      url: '../posts/getAll',
      headers: {
        "Content-Type": "application/json"
      }
    }).then((response) => {
      console.log(response.data);
      this.setState({
        isLoaded: true,
        posts: response.data
      }); 
    }).catch((error) => {
      this.setState({
        isLoaded: true,
        error
      });
    });
    
  }

  componentDidUpdate() {
    
    //Update Category State on Page Change
    if(this.state.category !== this.props.category || this.state.categoryExtra !== this.props.categoryExtra){
    this.setState({
      category: this.props.category,
      categoryExtra: this.props.categoryExtra
    })
  }


    
  
  }

  render() {
    const { error, isLoaded } = this.state;
    const postItemsFurniture = this.state.posts.slice(12, 15).map((post) => 
      <div key={post._id} className="col-lg-4 col-md-6 portfolio-item filter-transportation">
        <div className="portfolio-wrap">
          <img src={post.image} className="img-fluid" alt={post.name} />
          <div className="portfolio-info">
            <h4>{post.name}</h4>
            <p>${post.price}</p>
          </div>
          <div className="portfolio-links">
            <a href={post.image} data-gall="portfolioGallery" className="venobox" title={post.name}><i className="bx bx-plus"></i></a>
            <a href="/" title="More Details"><i className="bx bx-link"></i></a> 
          </div>
        </div>
      </div>
    );
    const postItemsTransportation = this.state.posts.slice(9, 12).map((post) => 
      <div key={post._id} className="col-lg-4 col-md-6 portfolio-item filter-furniture">
        <div className="portfolio-wrap">
          <img src={post.image} className="img-fluid" alt={post.name} />
          <div className="portfolio-info">
            <h4>{post.name}</h4>
            <p>${post.price}</p>
          </div>
          <div className="portfolio-links">
            <a href={post.image} data-gall="portfolioGallery" className="venobox" title={post.name}><i className="bx bx-plus"></i></a>
            <a href="/" title="More Details"><i className="bx bx-link"></i></a> 
          </div>
        </div>
      </div>
    );
    const postItemsCooking = this.state.posts.slice(1, 4).map((post) => 
      <div key={post._id} className="col-lg-4 col-md-6 portfolio-item filter-cooking-appliances">
        <div className="portfolio-wrap">
          <img src={post.image} className="img-fluid" alt={post.name} />
          <div className="portfolio-info">
            <h4>{post.name}</h4>
            <p>${post.price}</p>
          </div>
          <div className="portfolio-links">
            <a href={post.image} data-gall="portfolioGallery" className="venobox" title={post.name}><i className="bx bx-plus"></i></a>
            <a href="/" title="More Details"><i className="bx bx-link"></i></a> 
          </div>
        </div>
      </div>
    );
    if(error) {
      return <div>Error: {error.message}</div>;
    } else if(!isLoaded) {
      return <div>Loading ... </div>;
    } else {
      return (
        <div>
          <main id="main">
            <section id="portfolio" className="portfolio section-bg">
              <div className="container">
                <div className="section-title">
                    <h2>{this.state.category} Page</h2>
                    <h2>{this.state.categoryExtra}</h2>
                </div>
                <div id="searchBox">
                <input
                        type='text'
                        placeholder="Search Here..."
                        className="form-control"
                        onChange={this.myChangeHandler}
                />
                <br></br><br></br>
                <h2>Search Bar User Input ->  {this.state.search}</h2>
                </div>
                <div className="row portfolio-container" style={{paddingTop: "50px"}}>
                  {postItemsCooking}
                  {postItemsTransportation}
                  {postItemsFurniture}
                </div>
              </div>
            </section>
          </main>
        </div>
      );
    }
  }
}

export default Category;