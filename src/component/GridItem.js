const GridItem = ({ item, removeItem }) => {
    const content = () => {
        switch (item.type) {
            case 'iframe':
                return <iframe style={{ width: '100%', height: '100%' }} src={item.src} frameBorder={item.frameborder}></iframe>;
            case 'text':
            default:
                return item.content;
        }
    };

    return (
        <div className="card position-relative">
            <button className="btn btn-sm closeButton" onClick={() => removeItem(item.i)}>x</button>
            <div className="card-body">
                {content()}
            </div>
        </div>
    );
};

export default GridItem;
