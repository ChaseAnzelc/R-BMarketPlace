import React from 'react';
import axios from 'axios';

var loadjs = require('loadjs');

class AddProduct extends React.Component {
    componentDidMount() {
        loadjs('main.js');
    }

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            categoryid: '',
            price: '',
            date: '',
            city: '',
            state: '',
            address: '',
            ownerId: '',
            image: '',
            saletype: '',
            errorMessage: ''
        }
    }


    buildStateOptions() {
        var arr = [];
    
        const states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 
            'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 
            'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 
            'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 
            'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 
            'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 
            'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 
            'West Virginia', 'Wisconsin', 'Wyoming'];
    
        for(let i = 0; i <= states.length - 1; i++) {
            arr.push(<option key={i} value={states[i]}>{states[i]}</option>);
        }
    
        return arr;
    }

    buildSaleTypeOptions() {
        var arr = [];

        const saleTypes = ['Community', 'Services', 'Discussion Forms', 'Housing', 'For Sale', 'For Rent'];

        for(let i = 0; i <= saleTypes.length - 1; i++) {
            arr.push(<option key={i} value={saleTypes[i]}>{saleTypes[i]}</option>);
        }

        return arr;
    }

    buildCategoryTypeOptions() {
        var arr = [];

        const categories = ['Apts / Housing Rent', 'Apts / Housing For Sale', 
            'Office / Commerical Space Rent / For Sale', 'Furniture', 'Cooking', 'Transportation'];

        for(let i = 0; i <= categories.length - 1; i++) {
            arr.push(<option key={i} value={categories[i]}>{categories[i]}</option>)
        }

        return arr;
    }

    onChangeHandler = e => {
        e.preventDefault();
        let name = e.target.name;
        let val  = e.target.value;
        let err  = '';

        if(name === "price") {
            if(!Number(val)) {
                err = <p className="pt-2">Price has to be a number.</p>;
            }
        }

        this.setState({errorMessage: err});
        this.setState({[name]: val});
    }

    submitHandler = e => {
        e.preventDefault();
        this.addProduct(); 
    }

    async addProduct() {
        axios({
            method: 'POST',
            url: 'posts/create',
            data: {
                name:       this.state.name,
                categoryid: this.state.categoryid,
                price:      this.state.price,
                date:       this.state.date,
                city:       this.state.city,
                state:      this.state.state,
                address:    this.state.address,
                ownerID:    this.state.ownerId,
                image:      this.state.image,
                saletype:   this.state.saletype
            }
        }).then((response) => {
            if(response.status === 200) {
                console.log("Success");
            }
        }, error => {
            console.log(error);
            alert('The product could not be added.');
        });
    }
    
    render() {
        return (
            <div className="container mt-3 mb-5">
                <h1 className='text-center'>Add Product</h1>
                <form method="post" className="form-horizontal mt-4" onSubmit={this.submitHandler}>
                    <input type="hidden" className="form-control" name="date" value="3/8/2020"/>
                    <input type="hidden" className="form-control" name="ownerId" value="1"/>
                    <div className="row">
                        <div className="col-12 col-sm-6">
                            <label>Product Name</label>
                            <input type="text" onChange={this.onChangeHandler} className="form-control" name="name" required autoComplete="off"/>
                        </div>
                        <div className="col-12 col-sm-6">
                            <label>Description</label>
                            <textarea name="_description" rows="5" onChange={this.onChangeHandler} className="form-control" required></textarea>
                        </div> 
                    </div>
                    <div className="row mt-4">
                    <div className="col-12 col-sm-6">
                            <label>Sale Type</label>
                            <select className="form-control" onChange={this.onChangeHandler} name="saletype" required>
                                <option value="0">Choose a Sale Type</option>
                                {this.buildSaleTypeOptions()}
                            </select>
                        </div>
                        <div className="col-12 col-sm-6">
                            <label>Product Category</label>
                            <select name="categoryid" onChange={this.onChangeHandler} className="form-control" required>
                                <option value="0">Choose a Category</option>
                                {this.buildCategoryTypeOptions()}
                            </select>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-12 col-sm-6">
                            <label>Price</label>
                            <input type="number" onChange={this.onChangeHandler} className="form-control" name="price" autoComplete="off" required/>
                        </div>
                        <div className="col-12 col-sm-6">
                            <label>City</label>
                            <input type="text" onChange={this.onChangeHandler} className="form-control" name="city" required/>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-12 col-sm-6">
                            <label>State</label> 
                            <select onChange={this.onChangeHandler} className="form-control" name="state" required>
                                <option value="0">Choose a State</option>
                                {this.buildStateOptions()}
                            </select>
                        </div>
                        <div className="col-12 col-sm-6">
                            <label>Address</label> 
                            <input type="text" onChange={this.onChangeHandler} className="form-control" name="address" required/>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-12">
                            <label>Image</label>
                            <input type="file" onChange={this.onChangeHandler} className="form-control" name="image" required />
                        </div>
                    </div>
                    <button type="submit" style={loginButton} className="btn btn-block mt-3">Add Product</button>
                </form>
            </div>
        );
    }
}

export default AddProduct;

const loginButton = {
    backgroundColor: '#66ccff'
}