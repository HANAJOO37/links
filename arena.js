let markdownIt = document.createElement('script')
markdownIt.src = 'https://cdn.jsdelivr.net/npm/markdown-it@14.0.0/dist/markdown-it.min.js'
document.head.appendChild(markdownIt)

let channelSlug = 'brain-pop-rocks'

let placeChannelInfo = (data) => {
	let channelTitle = document.getElementById('channel-title')
	let channelDescription = document.getElementById('channel-description')
	let channelCount = document.getElementById('channel-count')
	let channelLink = document.getElementById('channel-link')

	channelTitle.innerHTML = data.title
	channelDescription.innerHTML = window.markdownit().render(data.metadata.description)
	channelCount.innerHTML = data.length
	channelLink.href = `https://www.are.na/channel/${channelSlug}`
}

let renderBlock = (block) => {
	let channelBlocks = document.getElementById('channel-blocks')

	if (block.class == 'Link') {
        let linkItem =
            `
			<li>
				<p><em>Link</em></p>
				<picture>
					<source media="(max-width: 428px)" srcset="${ block.image.thumb.url }">
					<source media="(max-width: 640px)" srcset="${ block.image.large.url }">
					<img src="${ block.image.original.url }">
				</picture>
				<h3>${ block.title }</h3>
				${ block.description_html }
				<p><a href="${ block.source.url }">See the original ↗</a></p>
			</li>
			`
		channelBlocks.insertAdjacentHTML('beforeend', linkItem)
    }
    
    else if (block.class == 'Image') {
	}

	else if (block.class == 'Text') {
    }
    
    else if (block.class == 'Attachment') {
		let attachment = block.attachment.content_type 

		if (attachment.includes('video')) {
			let videoItem =
				`
				<li>
					<p><em>Video</em></p>
					<video controls src="${ block.attachment.url }"></video>
				</li>
				`
			channelBlocks.insertAdjacentHTML('beforeend', videoItem)
        }
    
        else if (attachment.includes('pdf')) {
		}

		else if (attachment.includes('audio')) {
			let audioItem =
				`
				<li>
					<p><em>Audio</em></p>
					<audio controls src="${ block.attachment.url }"></video>
				</li>
				`
			channelBlocks.insertAdjacentHTML('beforeend', audioItem)
		}
    }
    
    else if (block.class == 'Media') {
		let embed = block.embed.type

		if (embed.includes('video')) {
			let linkedVideoItem =
				`
				<li>
					<p><em>Linked Video</em></p>
					${ block.embed.html }
				</li>
				`
			channelBlocks.insertAdjacentHTML('beforeend', linkedVideoItem)
        }
        
        else if (embed.includes('rich')) {
		}
	}
}

let renderUser = (user, container) => { 
	let userAddress =
		`
		<address>
			<img src="${ user.avatar_image.display }">
			<h3>${ user.first_name }</h3>
			<p><a href="https://are.na/${ user.slug }">Are.na profile ↗</a></p>
		</address>
		`
	container.insertAdjacentHTML('beforeend', userAddress)
}

fetch(`https://api.are.na/v2/channels/${channelSlug}?per=100`, { cache: 'no-store' })
	.then((response) => response.json()) 
	.then((data) => {
		console.log(data)
		placeChannelInfo(data) 

		data.contents.reverse().forEach((block) => {
			renderBlock(block)
		})

		let channelUsers = document.getElementById('channel-users') 
		data.collaborators.forEach((collaborator) => renderUser(collaborator, channelUsers))
		renderUser(data.user, channelUsers)
	})