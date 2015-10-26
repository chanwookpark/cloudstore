define(function (require) {
    'use strict';

    var React = require('react');
    var client = require('./client');

    var App = React.createClass({
        getInitialState: function () {
            return ({products: []});
        },
        componentDidMount: function () {
            client({method: 'GET', path: 'http://127.0.0.1:8002/api/products'}).done(response => {
                this.setState({products: response.entity._embedded.products});
            });
        },
        render: function () {
            return (
                <ProductList products={this.state.products}/>
            )
        }
    })

    var ProductList = React.createClass({
        render: function () {
            var products = this.props.products.map(product =>
                    <Product key={product._links.self.href} product={product}/>
            );
            return (
                <table>
                    <tr>
                        <th>Product ID</th>
                        <th>Product Name</th>
                        <th>Display Name</th>
                        <th>Tenant ID</th>
                    </tr>
                    {products}
                </table>
            )
        }
    })

    var Product = React.createClass({
        render: function () {
            return (
                <tr>
                    <td>{this.props.product.productId}</td>
                    <td>{this.props.product.productName}</td>
                    <td>{this.props.product.displayName}</td>
                    <td>{this.props.product.tenantId}</td>
                </tr>
            )
        }
    })

    React.render(
        <App />,
        document.getElementById('app')
    )
});