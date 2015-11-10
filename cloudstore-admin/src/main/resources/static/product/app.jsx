define(function (require) {
    'use strict';

    var React = require('react');
    var client = require('./client');
    var follow = require('./follow');

    var root = 'http://localhost:8002/api';

    var App = React.createClass({
        getInitialState: function () {
            return ({products: [], attributes: [], pageSize: 5, links: []});
        },
        componentDidMount: function () {
            this.loadFromServer(this.state.pageSize);
        },
        loadFromServer: function (pageSize) {
            follow(client, root, [
                    {rel: 'products', params: {size: pageSize}}]
            ).then(productCollection => {
                    return client({
                        method: 'GET',
                        path: productCollection.entity._links.profile.href,
                        headers: {'Accept': 'application/schema+json'}
                    }).then(schema => {
                        this.schema = schema.entity;
                        return productCollection;
                    });
                }).done(productCollection => {
                    this.setState({
                        products: productCollection.entity._embedded.products,
                        attributes: Object.keys(this.schema.properties),
                        pageSize: pageSize,
                        links: productCollection.entity._links
                    });
                });
        },
        onCreate: function (newProduct) {
            follow(client, root, ['products'])
                .then(productCollection => {
                    return client({
                        method: 'POST',
                        path: productCollection.entity._links.self.href,
                        entity: newProduct,
                        headers: {'Content-Type': 'application/json'}
                    })
                })
                .then(response => {
                    return follow(client, root, [
                        {rel: 'products', params: {'size': this.state.pageSize}}
                    ]);
                })
                .done(response => {
                    this.onNavigate(response.entity._links.last.href)
                });
        },
        onNavigate: function (navURI) {
            client({method: 'GET', path: navURI}).done(
                    productCollection => {
                    this.setState({
                        products: productCollection.entity._embedded.products,
                        attributes: this.state.attributes,
                        pageSize: this.state.pageSize,
                        links: productCollection.entity._links
                    });

                });
        },
        onDelete: function (product) {
            if (product != null) {
                client({method: 'DELETE', path: product._links.self.href})
                    .done(response => {
                        this.loadFromServer(this.state.pageSize);
                    });
            }
        },
        updatePageSize: function (pageSize) {
            if (pageSize !== this.state.pageSize) {
                this.loadFromServer(pageSize);
            }
        },
        render: function () {
            return (
                <div>
                    <CreateDialog attributes={this.state.attributes}
                                  onCreate={this.onCreate}/>

                    <ProductList products={this.state.products}
                                 links={this.state.links}
                                 pageSize={this.state.pageSize}
                                 onNavigate={this.onNavigate}
                                 onDelete={this.onDelete}
                                 updatePageSize={this.updatePageSize}/>
                </div>
            )
        }
    })

    var ProductList = React.createClass({
        handleInput: function (e) {
            e.preventDefault();

            var pageSize = React.findDOMNode(this.refs.pageSize).value;
            if (/^[0-9]+$/.test(pageSize)) {
                this.props.updatePageSize(pageSize);
            } else {
                React.findDOMNode(this.refs.pageSize).value = pageSize.substring(0, pageSize.length - 1);
            }
        },
        handleNavFirst: function (e) {
            e.preventDefault();
            this.props.onNavigate(this.props.links.first.href);
        },
        handleNavPrev: function (e) {
            e.preventDefault();
            this.props.onNavigate(this.props.links.prev.href);
        },
        handleNavNext: function (e) {
            e.preventDefault();
            this.props.onNavigate(this.props.links.next.href);
        },
        handleNavLast: function (e) {
            e.preventDefault();
            this.props.onNavigate(this.props.links.last.href);
        },
        render: function () {
            var products = this.props.products.map(product =>
                    <Product key={product._links.self.href} product={product}
                             onDelete={this.props.onDelete}/>
            );
            var navLinks = [];
            if ("first" in this.props.links) {
                navLinks.push(<button key="first" onClick={this.handleNavFirst}>&lt;&lt;</button>);
            }
            if ("prev" in this.props.links) {
                navLinks.push(<button key="prev" onClick={this.handleNavPrev}>&lt;</button>);
            }
            if ("next" in this.props.links) {
                navLinks.push(<button key="next" onClick={this.handleNavNext}>&gt;</button>);
            }
            if ("last" in this.props.links) {
                navLinks.push(<button key="last" onClick={this.handleNavLast}>&gt;&gt;</button>);
            }

            return (
                <div>
                    <input ref="pageSize" defaultValue={this.props.pageSize} onInput={this.handleInput}/>
                    <table>
                        <tr>
                            <th>Product ID</th>
                            <th>Product Name</th>
                            <th>Display Name</th>
                            <th>Tenant ID</th>
                            <th>(Action)</th>
                        </tr>
                        {products}
                    </table>
                    <div>
                        {navLinks}
                    </div>
                </div>
            )
        }
    })

    var Product = React.createClass({
        handleDelete: function () {
            this.props.onDelete(this.props.product);
        },
        render: function () {
            return (
                <tr>
                    <td>{this.props.product.productId}</td>
                    <td>{this.props.product.productName}</td>
                    <td>{this.props.product.displayName}</td>
                    <td>{this.props.product.tenantId}</td>
                    <td>
                        <button onClick={this.handleDelete}>Delete</button>
                    </td>
                </tr>
            )
        }
    })

    var CreateDialog = React.createClass({
        handleSubmit: function (e) {
            e.preventDefault();

            // create product by DOM value
            var newProduct = {};
            this.props.attributes.forEach(attribute => {
                newProduct[attribute] = React.findDOMNode(this.refs[attribute]).value.trim();
            });
            this.props.onCreate(newProduct);

            // clear dialog's input
            this.props.attributes.forEach(attribute => {
                React.findDOMNode(this.refs[attribute]).value = '';
            });

            // Navigate away
            window.location = "#";
        },
        render: function () {
            var inputs = this.props.attributes.map(attribute =>
                    <p key={attribute}>
                        <input type="text" placeholder={attribute} ref={attribute} className="field"/>
                    </p>
            );

            return (
                <div>
                    <a href="#createProduct">Create Product</a>

                    <div id="createProduct" className="modalDialog">
                        <div>
                            <a href="#" title="Close" className="close">X</a>

                            <h2>Create new product</h2>

                            <form>
                                {inputs}
                                <button onClick={this.handleSubmit}>CREATE</button>
                            </form>
                        </div>
                    </div>
                </div>
            )
        }
    });

    React.render(
        <App />,
        document.getElementById('app')
    )
});