function Spinner(props) {
	return <div className='spinner'>Please Wait..</div>
}

function Images(props) {

	return props.images.map((image, i) => {
		if (image) {
			return <div key={i} className='image-container'>
				<div 
					onClick={() => props.removeImage(i)} 
					className='delete'
				>
					x
				</div>
				<img className="gallery__item" src={image.url} data-orig-width={image.width} data-orig-height={image.height} alt='' />
			</div>
		}
		}
	)
}

function Button(props) {
	return 	<button className='button' onClick={props.onClick} >
			{props.title}
		</button>
}

function ButtonFromUrl(props) {
	return <div className="controls__from-url">
		<Button onClick={props.onClick} title="from URL" />
		<input type="text" onChange={event => setTitle(event.target.value)} placeholder="Type URL here" />
	</div>
}

class App extends React.Component {
  
	state = {
		uploading: false,
		images: []
	}
      
	loadFromLocalFile = e => {
		this.setState({ uploading: true })
	
		let imagesRequest = new Request('gallery-images.json');
		
		fetch(imagesRequest)
		.then(res => res.json())
		.then(images => {
			this.setState({ 
				uploading: false,
				productsAdded: true,
				images: images.galleryImages
			})
		})
	}
      
	loadFromUrl = e => {
		this.setState({ uploading: true, productsAdded: false,
		})
	    
		let imagesRequest = new Request(this.state.urlInputValue);
		
		checkImage(
			this.state.urlInputValue,
			() => this.setState({ 
					uploading: false,
					productsAdded: true,
					images: [{"url": this.state.urlInputValue}]
				})
			,
			() => fetch(imagesRequest)
				.then(res => res.json())
				.then(images => {
					this.setState({ 
						uploading: false,
						productsAdded: true,
						images: images.galleryImages
					})
				}).catch(err => alert('Could not load image from URL! Got this: \n\n' + err))
		)

		function checkImage(imageSrc, good, bad) {
			var img = new Image();
			img.onload = good; 
			img.onerror = bad;
			img.src = imageSrc;
		}
	}
	removeImage = id => {
	  this.setState({
	    images: this.galleryImages.filter(image => typeof image !== 'undefined' && image.id !== id),
	    productsAdded: false
	  })
	}
	
	handleUrlInputChange = event => {
		this.setState({ urlInputValue: event.target.value });
	}

	render() {
	  const { uploading, images, productsAdded } = this.state
	  const content = () => {
	    switch(true) {
	      case uploading:
		return <Spinner />
	      case images && images.length > 0:
		if (productsAdded) {
			this.galleryImages = images.concat(this.galleryImages);
		} else {
			this.galleryImages = images;
		}

		let newImages = [];
		this.galleryImages.forEach((elem,i) => {
			if (typeof elem !== 'undefined') {
				elem.id = i;
				newImages.push( elem );
			}
		});

		return <Images images={newImages} removeImage={this.removeImage} />
	      default:
		return
	    }
	  }

	let galleryImages = [];

	  return (<div>
			<h1>Image gallery</h1>
			<div className="controls">
				<Button onClick={this.loadFromLocalFile} title="from local file" />
				<div className="controls__from-url">
					<Button onClick={this.loadFromUrl} title="from URL" />
					<input type="text" onChange={this.handleUrlInputChange} placeholder="Type URL here" />
				</div>
			</div>
			<div>
				<div className="gallery">
					{content()}
				</div>
			</div>
		</div>
		)
	}

	componentDidUpdate(prevProps) {
		setTimeout(function(){jQuery(window).trigger('resize');}, 200);
	}
      }

ReactDOM.render(<App />, document.getElementById('root'))
