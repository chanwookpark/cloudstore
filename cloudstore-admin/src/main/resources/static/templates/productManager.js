var ProductBox = React.createClass({
    loadProductsFromServer: function () {
        $.ajax({
            url: this.props.url,
            type: 'GET',
            dataType: 'json',
            cache: false,
            crossDomain: true,
            success: function (data) {
                console.log("Server data:: " + JSON.stringify(data));
                var products = data._embedded.products;
                this.setState({data: products});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleProductSubmit: function (product) {
        var json = JSON.stringify(product);
        console.log("Create Product:: " + json);

        $.ajax({
            url: this.props.url,
            dataType: 'json',
            contentType: 'application/json',
            type: 'POST',
            data: json,
            crossDomain: true,
            success: function (data) {
                console.log("Create Resource Success:: " + JSON.stringify(data));

                // refresh
                this.loadProductsFromServer();
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
        this.loadProductsFromServer();
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },
    render: function () {
        return (
            <div className="productBox">
                <h1>Product Manager</h1>
                <ProductList data={this.state.data}/>
                <ProductForm onProductSubmit={this.handleProductSubmit}/>
            </div>
        );
    }
});


var ProductList = React.createClass({
    render: function () {
        var productNodes = this.props.data.map(function (product, index) {
            return (
                <Product productId={product.productId} productName={product.productName} key={index}>
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
                <b>{this.props.productId}. {this.props.productName}</b> <span dangerouslySetInnerHTML={this.rawMarkup()}/>
            </div>
        );
    }
});

var ProductForm = React.createClass({
    handleSubmit: function (e) {
        e.preventDefault();

        var productId = React.findDOMNode(this.refs.productId).value.trim();
        var productName = React.findDOMNode(this.refs.productName).value.trim();
        var displayName = React.findDOMNode(this.refs.displayName).value.trim();
        var tenantId = React.findDOMNode(this.refs.tenantId).value.trim();

        if (!productId || !productName || !displayName || !tenantId) {
            return;
        }

        // Send Server
        this.props.onProductSubmit(
            {'productId': productId, 'productName': productName, 'displayName': displayName, 'tenantId': tenantId});

        React.findDOMNode(this.refs.productId).value = '';
        React.findDOMNode(this.refs.productName).value = '';
        React.findDOMNode(this.refs.displayName).value = '';
        React.findDOMNode(this.refs.tenantId).value = '';
        return;
    },
    render: function () {
        return (
            <form className="productForm" onSubmit={this.handleSubmit}>
                <input type="text" placeholder="ID..." ref="productId"/>
                <input type="number" placeholder="Tenant..." ref="tenantId"/>
                <input type="text" placeholder="Product Name..." ref="productName"/>
                <input type="text" placeholder="Display Name..." ref="displayName"/>
                <input type="submit" value="Save"/>
            </form>
        );
    }
});

React.render(
    <ProductBox url="http://localhost:8002/api/products" pollInterval={10000}/>,
    document.getElementById('content')
);

