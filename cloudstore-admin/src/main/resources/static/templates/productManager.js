var ProductBox = React.createClass({
    loadCommentsFromServer: function () {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({data: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function () {
        return {data: []};
    },
    componentDidMount: function () {
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },
    render: function () {
        return (
            <div className="productBox">
                <h1>Product Manager</h1>
                <ProductList data={this.state.data}/>
                <ProductForm />
            </div>
        );
    }
});


var ProductList = React.createClass({
    render: function () {
        var productNodes = this.props.data.map(function (product) {
            return (
                <Product productId={product.productId} productName={product.productName}>
                    Product is {product.productId}!
                </Product>
            );
        });

        return (
            <div className="productList">
                {productNodes}
            </div>
        );
    }
});


var Product = React.createClass({
    rawMarkup: function () {
        var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
        return {__html: rawMarkup};
    },
    render: function () {
        return (
            <div className="product">
                <h2> {this.props.productId}. {this.props.productName} </h2>
                <span dangerouslySetInnerHTML={this.rawMarkup()}/>
            </div>
        );
    }
});


var ProductForm = React.createClass({
    render: function () {
        return (
            <div className="productForm">
                Hello, world! I am a ProductForm.
            </div>
        );
    }
});

React.render(
    <ProductBox url="http://localhost:8002/api/products" pollInterval={5000}/>,
    document.getElementById('content')
);

