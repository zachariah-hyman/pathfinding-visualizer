let initialNode = {
	cell: null,
	x: 10, y: 12,
	distance: 0,
	color: 'blue',
	visited: false
}

const destinationNode = {
	cell: null,
	x: 37, y: 12,
	distance: Infinity,
	color: 'red',
	visited: false
}

// var node = {
// 	cell: null,
// 	x: -1, y: -1,
// 	distance: Infinity,
// 	visited: false
// };
let dragging = false
let currentNode
let finished = false
let previousNode
let nodes = []
let unvisited = []

initializeDijkstra()
document.onmousedown = function(){handleMouseDown()}
document.onmouseup = function(){handleMouseUp()}









function handleMouseUp() {
	nodes.forEach(node => {
		node.cell.removeEventListener('mouseover', mouseOver)
	});

}






function handleMouseDown() {
	nodes.forEach(node => {
		if(node != initialNode && node != destinationNode){
			node.cell.addEventListener('mouseover', mouseOver)
		}
	});

}






function mouseOver(e) {
	if(dragging == true){
		e.target.style.backgroundColor = 'blue'
		return
	}
	if(e.target.style.backgroundColor != 'black'){
		if(e.target.style.backgroundColor != 'blue')
			e.target.style.backgroundColor = 'black'
		return
	}

	e.target.style.backgroundColor = 'white'
}






function initializeDijkstra(){
	currentNode = nodes[createUnvisitedSet()]
}







function createUnvisitedSet() { //also draws grid
	let startIndex = -1
	const grid = document.getElementById('grid')
	for(let i = 0; i < 25; i++){
		for (let j = 0; j < 47; j++){
			const cell = document.createElement('div')
			cell.style.gridRowStart = i+1
			cell.style.gridColumnStart = j+1
			if( j == initialNode.x && i == initialNode.y )
				cell.style.backgroundColor = initialNode.color
			if( j == destinationNode.x && i == destinationNode.y )
				cell.style.backgroundColor = destinationNode.color
			cell.classList.add('cell')
			grid.appendChild(cell)
			if( j == initialNode.x && i == initialNode.y ) {
				initialNode.cell = cell
				cell.addEventListener('mousedown', drag)
				cell.addEventListener('mouseup', drop)
				nodes.push(initialNode)
				startIndex = nodes.length - 1
			}
			else if( j == destinationNode.x && i == destinationNode.y ){
				destinationNode.cell = cell
				nodes.push(destinationNode)
			}
			else{
				cell.addEventListener('mousedown', mouseOver)
				nodes.push({cell: cell, x: i, y: j, distance: Infinity, visited: false})
			}
		}
	}

	return startIndex
}






function drag(e) {
	dragging = true
	nodes.forEach(node => {
		if(node != destinationNode){
			node.cell.addEventListener('mouseup', drop)
			node.cell.addEventListener('mouseout', mouseOut)
			node.cell.addEventListener('mouseover', mouseOver)
		}
	});
}






function drop() {

	nodes.forEach(node => {
		node.cell.removeEventListener('mouseup', drop)
		node.cell.removeEventListener('mouseout', mouseOut)
		node.cell.removeEventListener('mouseover', mouseOver)
		if(node != destinationNode){
			if(node.cell.style.backgroundColor == 'blue'){
				currentNode.distance = Infinity
				initialNode = node
				currentNode = node
				currentNode.distance = 0
				node.cell.addEventListener('mousedown', drag)
				node.cell.addEventListener('mouseup', drop)
				console.log(`${currentNode.x}, ${currentNode.y}`)
			}
		}
	});

	dragging = false
}






function mouseOut(e) {
	e.target.style.backgroundColor = 'white'
}







function handleClick(e) {
	e.target.style.backgroundColor = 'black'
}







function dijkstra() {

	let neighbors = getNeighbors()

	colorAndPush(neighbors)

	calculateDistances(neighbors)

	previousNode = markCurrentNodeVisited(currentNode)

	if(previousNode != initialNode){
		previousNode.cell.style.backgroundColor = 'green'
	}

	finished = destinationFound()

	if(finished == true){
		drawPath()
	}
 	else {
		currentNode = selectSmallest()

		if(currentNode.distance == Infinity){
			if(confirm("No path found. Press ok to reset.")){
				window.location = '/'
			}

			return
		}

		currentNode.cell.style.backgroundColor = 'yellow'

		window.requestAnimationFrame(dijkstra)
	}
}






function drawPath(){
	// alert(`destination is ${currentNode.distance}`)
	destinationNode.cell.style.backgroundColor = 'yellow'

	neighbors = getNeighbors()

	for (let i = 0; i < neighbors.length; i++){
		if(neighbors[i].distance < currentNode.distance){
			currentNode.cell.style.backgroundColor = 'yellow'
			currentNode = neighbors[i]
			break
		}
	}

	if(currentNode.distance == 1){
		initialNode.cell.style.backgroundColor = 'yellow'
	}

	window.requestAnimationFrame(drawPath)
}






function selectSmallest() {
	let smallest = unvisited[0]

	for(let i = 0; i < unvisited.length; i++){
		if(unvisited[i].distance < smallest.distance)
			smallest = unvisited[i]
	}

	return smallest
}







function getNeighbors() {
	neighbors = []

	if(!currentOnTopBoundary()) {
		neighbors.push(getTop())
	}
	if(!currentOnRightBoundary()) {
		neighbors.push(getRight())
	}

	if(!currentOnBottomBoundary()) {
		neighbors.push(getBottom())
	}

	if(!currentOnLeftBoundary()) {
		neighbors.push(getLeft())
	}

	return neighbors
}






function colorAndPush(neighbors) {
	neighbors.forEach(neighbor => {
		if(neighbor != initialNode && neighbor.cell.style.backgroundColor != 'black'){
			neighbor.cell.style.backgroundColor = 'green'
		}
		if(neighbor.visited == false && !unvisited.includes(neighbor)){
			unvisited.push(neighbor)
		}
	});
}






function currentOnLeftBoundary() {
	if(nodes.indexOf(currentNode)%47 == 0)
		return true

	return false
}





function currentOnRightBoundary() {
	if(nodes.indexOf(currentNode)%47 == 46)
		return true

	return false
}






function currentOnTopBoundary() {
	if(nodes.indexOf(currentNode) < 47)
		return true

	return false
}





function currentOnBottomBoundary() {
	if(nodes.indexOf(currentNode) >= 24*47)
		return true

	return false
}






function getTop() {
	return nodes[nodes.indexOf(currentNode) - 47]
}




function getBottom() {
	return nodes[nodes.indexOf(currentNode) + 47]
}





function getLeft() {
	return nodes[nodes.indexOf(currentNode) - 1]
}





function getRight() {
	return nodes[nodes.indexOf(currentNode) + 1]
}








function calculateDistances(neighbors) {
	neighbors.forEach(neighbor => {
		if(neighbor.cell.style.backgroundColor != 'black'){
			if(currentNode.distance+1 < neighbor.distance){
				neighbor.distance = currentNode.distance+1
			}
		}
	});

}






function markCurrentNodeVisited(node) {
	node.visited = true
	unvisited.splice(unvisited.indexOf(node), 1)
	return node
}






function destinationFound() {
	if(destinationNode.distance < Infinity){
		return true;
	}

	return false
}
