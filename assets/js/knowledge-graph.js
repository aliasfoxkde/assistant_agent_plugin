// Knowledge Graph Animation for MENTOR Learning Platform
// This creates an interactive network of nodes and connections that respond to cursor movement

class KnowledgeGraph {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.nodes = [];
    this.connections = [];
    this.mouse = { x: 0, y: 0, radius: 150 };
    this.learningConcepts = [
      'AI', 'Math', 'Science', 'History', 'Language', 
      'Art', 'Music', 'Coding', 'Physics', 'Chemistry',
      'Biology', 'Literature', 'Geography', 'Psychology',
      'Philosophy', 'Economics', 'Statistics', 'Data Science'
    ];
    
    // Initialize
    this.resizeCanvas();
    this.createNodes();
    this.createConnections();
    this.addEventListeners();
    this.animate();
  }
  
  resizeCanvas() {
    const heroSection = this.canvas.parentElement;
    this.canvas.width = heroSection.offsetWidth;
    this.canvas.height = heroSection.offsetHeight;
  }
  
  createNodes() {
    const nodeCount = Math.min(this.learningConcepts.length, 18); // Limit to avoid overcrowding
    
    for (let i = 0; i < nodeCount; i++) {
      const radius = Math.random() * 3 + 2;
      const x = Math.random() * (this.canvas.width - radius * 2) + radius;
      const y = Math.random() * (this.canvas.height - radius * 2) + radius;
      const speedFactor = 0.5;
      const dx = (Math.random() - 0.5) * speedFactor;
      const dy = (Math.random() - 0.5) * speedFactor;
      
      // Assign colors based on concept categories
      let color;
      if (i < 6) {
        // STEM subjects
        color = '#4a6cf7'; // Primary blue
      } else if (i < 12) {
        // Humanities
        color = '#10b981'; // Green
      } else {
        // Arts and others
        color = '#f59e0b'; // Orange
      }
      
      this.nodes.push({
        x,
        y,
        radius,
        dx,
        dy,
        color,
        text: this.learningConcepts[i],
        originalRadius: radius,
        highlighted: false
      });
    }
  }
  
  createConnections() {
    // Create connections between nodes that are close to each other
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const dx = this.nodes[i].x - this.nodes[j].x;
        const dy = this.nodes[i].y - this.nodes[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Connect nodes that are within a certain distance
        if (distance < this.canvas.width / 4) {
          this.connections.push({
            from: i,
            to: j,
            opacity: 0.5 - (distance / (this.canvas.width / 4)) * 0.5
          });
        }
      }
    }
  }
  
  addEventListeners() {
    // Track mouse movement
    window.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });
    
    // Handle resize
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      // Reposition nodes after resize
      this.nodes.forEach(node => {
        node.x = Math.min(node.x, this.canvas.width - node.radius);
        node.y = Math.min(node.y, this.canvas.height - node.radius);
      });
    });
    
    // Handle touch events for mobile
    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.touches[0].clientX - rect.left;
      this.mouse.y = e.touches[0].clientY - rect.top;
    });
  }
  
  drawNodes() {
    this.nodes.forEach(node => {
      // Draw node
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = node.color;
      this.ctx.fill();
      
      // Draw text for highlighted nodes
      if (node.highlighted) {
        this.ctx.font = '12px Arial';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Draw text background
        const textWidth = this.ctx.measureText(node.text).width;
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(
          node.x - textWidth / 2 - 5,
          node.y - 20 - 10,
          textWidth + 10,
          20
        );
        
        // Draw text
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText(node.text, node.x, node.y - 20);
      }
    });
  }
  
  drawConnections() {
    this.connections.forEach(connection => {
      const fromNode = this.nodes[connection.from];
      const toNode = this.nodes[connection.to];
      
      // Calculate distance between nodes
      const dx = fromNode.x - toNode.x;
      const dy = fromNode.y - toNode.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Draw connection line
      this.ctx.beginPath();
      this.ctx.moveTo(fromNode.x, fromNode.y);
      this.ctx.lineTo(toNode.x, toNode.y);
      
      // Adjust opacity based on distance and if nodes are highlighted
      let opacity = connection.opacity;
      if (fromNode.highlighted || toNode.highlighted) {
        opacity = Math.min(1, opacity * 2);
      }
      
      this.ctx.strokeStyle = `rgba(74, 108, 247, ${opacity})`;
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    });
  }
  
  updateNodes() {
    this.nodes.forEach(node => {
      // Check if mouse is near the node
      const dx = this.mouse.x - node.x;
      const dy = this.mouse.y - node.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Highlight node if mouse is close
      if (distance < this.mouse.radius) {
        const scaleFactor = 1 - distance / this.mouse.radius;
        node.radius = node.originalRadius + scaleFactor * 5;
        node.highlighted = true;
      } else {
        node.radius = node.originalRadius;
        node.highlighted = false;
      }
      
      // Move node
      node.x += node.dx;
      node.y += node.dy;
      
      // Bounce off walls
      if (node.x + node.radius > this.canvas.width || node.x - node.radius < 0) {
        node.dx = -node.dx;
      }
      
      if (node.y + node.radius > this.canvas.height || node.y - node.radius < 0) {
        node.dy = -node.dy;
      }
      
      // Keep node within canvas
      node.x = Math.max(node.radius, Math.min(this.canvas.width - node.radius, node.x));
      node.y = Math.max(node.radius, Math.min(this.canvas.height - node.radius, node.y));
    });
  }
  
  animate() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update and draw
    this.updateNodes();
    this.drawConnections();
    this.drawNodes();
    
    // Loop animation
    requestAnimationFrame(this.animate.bind(this));
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Check if the hero section and canvas exist
  const heroCanvas = document.getElementById('knowledge-graph');
  if (heroCanvas) {
    new KnowledgeGraph('knowledge-graph');
  }
});
