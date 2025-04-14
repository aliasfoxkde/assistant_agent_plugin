// Knowledge Graph Animation for MENTOR Learning Platform
// This creates an interactive network of nodes and connections that respond to cursor movement

class KnowledgeGraph {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.nodes = [];
    this.connections = [];
    this.pulses = []; // Neural pulses traveling along connections
    this.neuronFirings = []; // Visual effects for neuron firing
    this.mouse = { x: 0, y: 0, radius: 150 };
    this.lastPulseTime = 0; // Track when the last pulse was created
    this.pulseInterval = 1000; // Milliseconds between automatic pulses
    this.clickTime = 0; // Track when the user last clicked
    this.learningConcepts = [
      'AI', 'Neural Networks', 'Machine Learning', 'Deep Learning', 'NLP',
      'Math', 'Science', 'History', 'Language', 'Art', 'Music',
      'Coding', 'Physics', 'Chemistry', 'Biology', 'Literature',
      'Geography', 'Psychology', 'Philosophy', 'Economics',
      'Statistics', 'Data Science', 'Robotics', 'Computer Vision'
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
    const nodeCount = Math.min(this.learningConcepts.length, 24); // Increased to show more concepts

    for (let i = 0; i < nodeCount; i++) {
      // Vary node sizes more to represent different neuron types
      const radius = Math.random() * 4 + 2;
      const x = Math.random() * (this.canvas.width - radius * 2) + radius;
      const y = Math.random() * (this.canvas.height - radius * 2) + radius;
      const speedFactor = 0.3; // Slightly slower movement for more stability
      const dx = (Math.random() - 0.5) * speedFactor;
      const dy = (Math.random() - 0.5) * speedFactor;

      // Assign colors based on concept categories with neural network theme
      let color, nodeType;
      if (i < 5) {
        // AI and ML concepts - represent as input neurons
        color = '#4a6cf7'; // Primary blue
        nodeType = 'input';
      } else if (i < 15) {
        // Core subjects - represent as hidden neurons
        color = '#10b981'; // Green
        nodeType = 'hidden';
      } else {
        // Specialized subjects - represent as output neurons
        color = '#f59e0b'; // Orange
        nodeType = 'output';
      }

      // Add pulse frequency - how often this neuron can fire
      const pulseFrequency = Math.random() * 5000 + 3000; // Between 3-8 seconds
      const lastPulseTime = Date.now() - (Math.random() * pulseFrequency); // Stagger initial pulses

      this.nodes.push({
        x,
        y,
        radius,
        dx,
        dy,
        color,
        text: this.learningConcepts[i],
        originalRadius: radius,
        highlighted: false,
        nodeType,
        pulseFrequency,
        lastPulseTime,
        energy: Math.random() * 0.5, // Initial energy level (0-0.5)
        energyThreshold: 0.7, // Threshold to fire (0.7-1.0)
        firingState: 0 // 0: resting, 1: firing, 2: refractory
      });
    }
  }

  createConnections() {
    // Create connections between nodes that are close to each other
    for (let i = 0; i < this.nodes.length; i++) {
      // Each node should have at least 2-4 connections
      const minConnections = 2;
      let connectionCount = 0;

      // Sort other nodes by distance
      const potentialConnections = [];
      for (let j = 0; j < this.nodes.length; j++) {
        if (i !== j) {
          const dx = this.nodes[i].x - this.nodes[j].x;
          const dy = this.nodes[i].y - this.nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          potentialConnections.push({ index: j, distance });
        }
      }

      // Sort by distance
      potentialConnections.sort((a, b) => a.distance - b.distance);

      // Connect to closest nodes
      for (let k = 0; k < Math.min(minConnections, potentialConnections.length); k++) {
        const j = potentialConnections[k].index;
        const distance = potentialConnections[k].distance;

        // Avoid duplicate connections
        if (!this.connections.some(conn =>
          (conn.from === i && conn.to === j) || (conn.from === j && conn.to === i)
        )) {
          // Create neural network style connection with weight and direction
          const weight = Math.random() * 0.5 + 0.5; // Connection strength (0.5-1.0)
          const direction = Math.random() > 0.5 ? 1 : -1; // Excitatory or inhibitory

          this.connections.push({
            from: i,
            to: j,
            distance,
            opacity: 0.5 - (distance / (this.canvas.width / 3)) * 0.5,
            weight,
            direction,
            pulses: [], // Store pulses traveling along this connection
            active: false // Whether this connection is currently active
          });
          connectionCount++;
        }
      }

      // Add some random longer connections (small world network property)
      if (Math.random() < 0.3) { // 30% chance for each node
        const randomIndex = Math.floor(Math.random() * this.nodes.length);
        if (i !== randomIndex && !this.connections.some(conn =>
          (conn.from === i && conn.to === randomIndex) ||
          (conn.from === randomIndex && conn.to === i)
        )) {
          const dx = this.nodes[i].x - this.nodes[randomIndex].x;
          const dy = this.nodes[i].y - this.nodes[randomIndex].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          const weight = Math.random() * 0.5 + 0.5;
          const direction = Math.random() > 0.5 ? 1 : -1;

          this.connections.push({
            from: i,
            to: randomIndex,
            distance,
            opacity: 0.3, // Lower opacity for long-distance connections
            weight,
            direction,
            pulses: [],
            active: false
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

    // Handle click events to trigger neuron firing
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Find the closest node to the click
      let closestNode = null;
      let closestDistance = Infinity;

      this.nodes.forEach((node, index) => {
        const dx = clickX - node.x;
        const dy = clickY - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestNode = index;
        }
      });

      // If click is close enough to a node, trigger a neural firing
      if (closestNode !== null && closestDistance < 50) {
        this.triggerNeuronFiring(closestNode);
        this.clickTime = Date.now();
      }
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

    // Handle touch tap events for mobile
    this.canvas.addEventListener('touchend', (e) => {
      if (e.changedTouches.length > 0) {
        const rect = this.canvas.getBoundingClientRect();
        const touchX = e.changedTouches[0].clientX - rect.left;
        const touchY = e.changedTouches[0].clientY - rect.top;

        // Find the closest node to the touch
        let closestNode = null;
        let closestDistance = Infinity;

        this.nodes.forEach((node, index) => {
          const dx = touchX - node.x;
          const dy = touchY - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestNode = index;
          }
        });

        // If touch is close enough to a node, trigger a neural firing
        if (closestNode !== null && closestDistance < 50) {
          this.triggerNeuronFiring(closestNode);
          this.clickTime = Date.now();
        }
      }
    });
  }

  drawNodes() {
    // First draw neuron firing effects (so they appear behind the neurons)
    this.drawNeuronFiringEffects();

    this.nodes.forEach(node => {
      // Draw neuron glow effect if firing
      if (node.firingState === 1) {
        // Draw dramatic outer glow with pulsating effect
        const time = Date.now();
        const pulseFactor = 1 + 0.2 * Math.sin(time / 100); // Pulsating size
        const glowRadius = node.radius * 3.5 * pulseFactor;

        // Create multi-color gradient for more dramatic effect
        const gradient = this.ctx.createRadialGradient(
          node.x, node.y, node.radius,
          node.x, node.y, glowRadius
        );

        // Inner bright white core
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        // Middle color based on neuron type
        gradient.addColorStop(0.3, `rgba(${this.getColorValues(node.color)}, 0.8)`);
        // Outer fade
        gradient.addColorStop(1, `rgba(${this.getColorValues(node.color)}, 0)`);

        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();

        // Draw electric-like spikes around firing neuron
        this.drawNeuronSpikes(node, time);
      }

      // Draw dendrites (small branches) for neurons with higher energy
      if (node.energy > 0.4) {
        this.drawDendrites(node);
      }

      // Draw node (neuron cell body)
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);

      // Color based on neuron state with more dramatic effects
      let fillColor = node.color;
      if (node.firingState === 1) {
        // Much brighter color when firing (almost white)
        fillColor = this.lightenColor(node.color, 70);

        // Add a stroke for emphasis
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
      } else if (node.firingState === 2) {
        // Darker color in refractory period
        fillColor = this.darkenColor(node.color, 30);
      }

      this.ctx.fillStyle = fillColor;
      this.ctx.fill();

      // Draw energy level indicator with pulsating effect
      if (node.energy > 0.1) {
        const energyPulse = node.energy > 0.6 ? 1 + 0.1 * Math.sin(Date.now() / 200) : 1;
        const energyRadius = node.radius * 0.7 * (node.energy / node.energyThreshold) * energyPulse;

        // Create gradient for energy indicator
        const energyGradient = this.ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, energyRadius
        );
        energyGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        energyGradient.addColorStop(1, 'rgba(255, 255, 255, 0.3)');

        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, energyRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = energyGradient;
        this.ctx.fill();
      }

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

      // Calculate distance and direction between nodes
      const dx = toNode.x - fromNode.x;
      const dy = toNode.y - fromNode.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);

      // Normalize direction vector
      const nx = dx / distance;
      const ny = dy / distance;

      // Adjust start and end points to be at the edge of the nodes
      const startX = fromNode.x + nx * fromNode.radius;
      const startY = fromNode.y + ny * fromNode.radius;
      const endX = toNode.x - nx * toNode.radius;
      const endY = toNode.y - ny * toNode.radius;

      // Determine if this is a strong connection (representing learned pathway)
      const isStrong = connection.strength && connection.strength > 0.6;

      // Draw connection line with appropriate style
      if (isStrong) {
        // Draw strong connections with double line to represent myelin sheath
        // (myelinated connections in the brain conduct signals faster)
        this.drawMyelinatedConnection(startX, startY, endX, endY, connection, nx, ny, distance);
      } else {
        // Draw regular connection
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);

        // Adjust opacity based on distance, node state, and if nodes are highlighted
        let opacity = connection.opacity;
        let lineColor;
        let lineWidth = 1;

        // Highlight connections when nodes are highlighted
        if (fromNode.highlighted || toNode.highlighted) {
          opacity = Math.min(1, opacity * 2);
          lineWidth = 1.5;
        }

        // Show active connections (when a pulse is traveling)
        if (connection.active) {
          lineWidth = 2;
          // Color based on connection direction (excitatory/inhibitory)
          if (connection.direction > 0) {
            lineColor = `rgba(74, 108, 247, ${opacity})`; // Blue for excitatory
          } else {
            lineColor = `rgba(247, 74, 74, ${opacity})`; // Red for inhibitory
          }
        } else {
          // Default connection color
          lineColor = `rgba(74, 108, 247, ${opacity})`;
        }

        // Draw the connection
        this.ctx.strokeStyle = lineColor;
        this.ctx.lineWidth = lineWidth;
        this.ctx.stroke();
      }

      // Draw direction indicator (small arrow)
      if (fromNode.highlighted || toNode.highlighted || connection.active) {
        // Calculate position for the arrow (70% along the connection)
        const arrowX = startX + nx * distance * 0.7;
        const arrowY = startY + ny * distance * 0.7;

        // Draw arrow
        this.ctx.beginPath();
        this.ctx.moveTo(arrowX, arrowY);
        this.ctx.lineTo(
          arrowX - 5 * Math.cos(angle - Math.PI / 6),
          arrowY - 5 * Math.sin(angle - Math.PI / 6)
        );
        this.ctx.moveTo(arrowX, arrowY);
        this.ctx.lineTo(
          arrowX - 5 * Math.cos(angle + Math.PI / 6),
          arrowY - 5 * Math.sin(angle + Math.PI / 6)
        );
        this.ctx.stroke();
      }

      // Draw pulses traveling along the connection
      if (connection.pulses && connection.pulses.length > 0) {
        connection.pulses.forEach(pulse => {
          // Calculate pulse position along the connection
          const pulseX = startX + nx * distance * pulse.progress;
          const pulseY = startY + ny * distance * pulse.progress;

          // Draw pulse with trail effect
          this.drawPulseWithTrail(pulseX, pulseY, pulse, nx, ny, startX, startY);
        });
      }
    });
  }

  // Draw a myelinated connection (representing a learned, strong neural pathway)
  drawMyelinatedConnection(startX, startY, endX, endY, connection, nx, ny, distance) {
    const fromNode = this.nodes[connection.from];
    const toNode = this.nodes[connection.to];

    // Draw the main connection line
    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(endX, endY);

    // Determine color and width based on connection properties
    let opacity = Math.min(1, connection.opacity * 1.5); // Stronger connections are more visible
    let lineColor;

    // Color based on connection direction (excitatory/inhibitory)
    if (connection.direction > 0) {
      // Bright blue for excitatory
      lineColor = `rgba(100, 149, 237, ${opacity})`;
    } else {
      // Bright red for inhibitory
      lineColor = `rgba(220, 20, 60, ${opacity})`;
    }

    // Draw the main connection with thicker line
    this.ctx.strokeStyle = lineColor;
    this.ctx.lineWidth = 2.5;
    this.ctx.stroke();

    // Draw myelin segments (the insulating segments along axons)
    const segmentCount = Math.floor(distance / 15); // One segment every ~15px
    const segmentLength = distance / segmentCount;
    const gapLength = segmentLength * 0.2; // Small gaps between segments

    for (let i = 0; i < segmentCount; i++) {
      const segmentStart = i * segmentLength;
      const segmentEnd = segmentStart + segmentLength - gapLength;

      // Skip if segment is too small
      if (segmentEnd - segmentStart < 5) continue;

      // Calculate segment positions
      const segStartX = startX + nx * segmentStart;
      const segStartY = startY + ny * segmentStart;
      const segEndX = startX + nx * segmentEnd;
      const segEndY = startY + ny * segmentEnd;

      // Draw myelin sheath (outer insulation)
      this.ctx.beginPath();
      this.ctx.moveTo(segStartX, segStartY);
      this.ctx.lineTo(segEndX, segEndY);
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      this.ctx.lineWidth = 4;
      this.ctx.stroke();
    }

    // If connection is active, add a pulsating effect
    if (connection.active) {
      const time = Date.now();
      const pulseOpacity = 0.3 + 0.2 * Math.sin(time / 200);

      this.ctx.beginPath();
      this.ctx.moveTo(startX, startY);
      this.ctx.lineTo(endX, endY);
      this.ctx.strokeStyle = `rgba(255, 255, 255, ${pulseOpacity})`;
      this.ctx.lineWidth = 6;
      this.ctx.stroke();
    }
  }

  // Draw a pulse with trailing effect
  drawPulseWithTrail(pulseX, pulseY, pulse, nx, ny, startX, startY) {
    // Draw main pulse
    const pulseRadius = 4;

    // Create gradient for pulse
    const gradient = this.ctx.createRadialGradient(
      pulseX, pulseY, 0,
      pulseX, pulseY, pulseRadius * 2
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    gradient.addColorStop(0.5, pulse.color);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    // Draw pulse with gradient
    this.ctx.beginPath();
    this.ctx.arc(pulseX, pulseY, pulseRadius * 2, 0, Math.PI * 2);
    this.ctx.fillStyle = gradient;
    this.ctx.fill();

    // Draw smaller, brighter core
    this.ctx.beginPath();
    this.ctx.arc(pulseX, pulseY, pulseRadius, 0, Math.PI * 2);
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    this.ctx.fill();

    // Draw trailing effect
    const trailLength = 0.1; // 10% of the connection length
    const trailStartProgress = Math.max(0, pulse.progress - trailLength);

    // Calculate trail start position
    const trailStartX = startX + nx * (pulse.progress - trailLength) * (pulseX - startX) / pulse.progress;
    const trailStartY = startY + ny * (pulse.progress - trailLength) * (pulseY - startY) / pulse.progress;

    // Create gradient for trail
    const trailGradient = this.ctx.createLinearGradient(
      trailStartX, trailStartY,
      pulseX, pulseY
    );
    trailGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
    trailGradient.addColorStop(1, pulse.color);

    // Draw trail
    this.ctx.beginPath();
    this.ctx.moveTo(trailStartX, trailStartY);
    this.ctx.lineTo(pulseX, pulseY);
    this.ctx.strokeStyle = trailGradient;
    this.ctx.lineWidth = pulseRadius * 2;
    this.ctx.lineCap = 'round';
    this.ctx.stroke();
    this.ctx.lineCap = 'butt'; // Reset line cap
  }

  updateNodes() {
    const currentTime = Date.now();

    // Check for synchronized firing patterns (neural assemblies)
    const activeNodes = this.nodes.filter(node => node.firingState === 1).length;
    const totalNodes = this.nodes.length;
    const synchronizationRatio = activeNodes / totalNodes;

    // If many neurons are firing at once, create a "brain wave" effect
    if (synchronizationRatio > 0.1) { // More than 10% of neurons firing together
      this.createBrainWave();
    }

    // Update each neuron
    this.nodes.forEach((node, index) => {
      // Check if mouse is near the node
      const dx = this.mouse.x - node.x;
      const dy = this.mouse.y - node.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Highlight node if mouse is close
      if (distance < this.mouse.radius) {
        const scaleFactor = 1 - distance / this.mouse.radius;
        node.radius = node.originalRadius + scaleFactor * 5;
        node.highlighted = true;

        // Increase energy when mouse is close (simulating external stimulation)
        node.energy = Math.min(node.energy + 0.002, node.energyThreshold * 0.9);

        // Occasionally trigger firing directly with mouse proximity (direct stimulation)
        if (distance < 30 && Math.random() < 0.01 && node.firingState === 0) {
          this.triggerNeuronFiring(index);
        }
      } else {
        node.radius = node.originalRadius;
        node.highlighted = false;
      }

      // Update neuron state based on neural dynamics
      if (node.firingState === 1) { // Firing state
        // Transition to refractory period after firing
        node.firingState = 2;
        node.energy = 0; // Reset energy after firing
        node.firingCount = (node.firingCount || 0) + 1; // Track firing count for learning

        // Trigger pulses along connections
        this.triggerPulses(index);
      } else if (node.firingState === 2) { // Refractory period
        // Gradually recover from refractory period
        if (currentTime - node.lastPulseTime > 800) { // 0.8 second refractory period
          node.firingState = 0; // Back to resting state
        }
      } else { // Resting state
        // Spontaneous activity (random firing)
        if (Math.random() < 0.005) { // 0.5% chance per frame
          node.energy += 0.02;
        }

        // Neurons that fire together wire together (Hebbian learning)
        // Find recently active neighbors and increase energy if they fired recently
        this.connections.forEach(conn => {
          if (conn.from === index || conn.to === index) {
            const otherNodeIndex = conn.from === index ? conn.to : conn.from;
            const otherNode = this.nodes[otherNodeIndex];

            // If the other node fired recently, increase this node's energy
            if (otherNode.firingState === 2 && currentTime - otherNode.lastPulseTime < 500) {
              node.energy += 0.01 * conn.weight;
            }
          }
        });

        // Automatic firing based on pulse frequency (rhythmic activity)
        if (currentTime - node.lastPulseTime > node.pulseFrequency && Math.random() < 0.05) {
          if (node.energy > node.energyThreshold * 0.7) {
            this.triggerNeuronFiring(index);
          }
        }

        // Check if energy threshold is reached
        if (node.energy >= node.energyThreshold) {
          this.triggerNeuronFiring(index);
        }
      }

      // Slowly decrease energy over time (leaky integrate-and-fire model)
      node.energy = Math.max(0, node.energy - 0.0008);

      // Move node with slight attraction to other connected nodes
      let attractionX = 0;
      let attractionY = 0;

      // Find connected nodes and calculate attraction
      this.connections.forEach(conn => {
        if (conn.from === index || conn.to === index) {
          const otherNodeIndex = conn.from === index ? conn.to : conn.from;
          const otherNode = this.nodes[otherNodeIndex];

          // Calculate direction to other node
          const dx = otherNode.x - node.x;
          const dy = otherNode.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Add small attraction force (stronger for frequently used connections)
          const strength = 0.00005 * (conn.strength || 1);
          attractionX += (dx / distance) * strength;
          attractionY += (dy / distance) * strength;
        }
      });

      // Apply attraction forces
      node.dx += attractionX;
      node.dy += attractionY;

      // Limit maximum speed
      const speed = Math.sqrt(node.dx * node.dx + node.dy * node.dy);
      if (speed > 0.8) {
        node.dx = (node.dx / speed) * 0.8;
        node.dy = (node.dy / speed) * 0.8;
      }

      // Move node
      node.x += node.dx;
      node.y += node.dy;

      // Bounce off walls
      if (node.x + node.radius > this.canvas.width || node.x - node.radius < 0) {
        node.dx = -node.dx * 0.8; // Add damping
      }

      if (node.y + node.radius > this.canvas.height || node.y - node.radius < 0) {
        node.dy = -node.dy * 0.8; // Add damping
      }

      // Keep node within canvas
      node.x = Math.max(node.radius, Math.min(this.canvas.width - node.radius, node.x));
      node.y = Math.max(node.radius, Math.min(this.canvas.height - node.radius, node.y));
    });

    // Update pulses traveling along connections
    this.updatePulses();

    // Periodically update connection strengths based on usage (neural plasticity)
    if (currentTime - (this.lastLearningUpdate || 0) > 2000) { // Every 2 seconds
      this.updateConnectionStrengths();
      this.lastLearningUpdate = currentTime;
    }
  }

  // Create a brain wave effect when many neurons fire together
  createBrainWave() {
    // Add a visual effect that spreads across the network
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    // Create expanding ring effect
    this.neuronFirings.push({
      x: centerX,
      y: centerY,
      radius: 50,
      opacity: 0.3,
      color: '#ffffff',
      isBrainWave: true
    });
  }

  // Update connection strengths based on usage (neural plasticity)
  updateConnectionStrengths() {
    this.connections.forEach(connection => {
      const fromNode = this.nodes[connection.from];
      const toNode = this.nodes[connection.to];

      // Initialize strength if not present
      if (!connection.strength) {
        connection.strength = connection.weight || 0.5;
        connection.usageCount = 0;
      }

      // Strengthen connections that are used frequently
      if (connection.usageCount > 0) {
        // Hebbian learning: neurons that fire together, wire together
        connection.strength = Math.min(1.0, connection.strength + 0.01 * connection.usageCount);
        connection.usageCount = 0; // Reset usage count
      } else {
        // Slight weakening of unused connections (synaptic pruning)
        connection.strength = Math.max(0.1, connection.strength - 0.001);
      }
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

  // Helper method to trigger neuron firing
  triggerNeuronFiring(nodeIndex) {
    const node = this.nodes[nodeIndex];
    if (node.firingState === 0) { // Only fire if in resting state
      node.firingState = 1; // Set to firing state
      node.lastPulseTime = Date.now();

      // Create visual firing effect
      this.neuronFirings.push({
        x: node.x,
        y: node.y,
        radius: node.radius * 2,
        opacity: 1.0,
        color: node.color
      });
    }
  }

  // Helper method to trigger pulses along connections
  triggerPulses(nodeIndex) {
    // Find all connections from this node
    this.connections.forEach(connection => {
      if (connection.from === nodeIndex) {
        connection.active = true;

        // Determine if this is a strong connection (learned pathway)
        const isStrong = connection.strength && connection.strength > 0.6;

        // Create a pulse with properties based on connection strength
        const pulse = {
          progress: 0, // 0 to 1 (start to end)
          speed: isStrong ? 0.02 : 0.01, // Faster travel on strong connections
          color: connection.direction > 0 ? '#4a6cf7' : '#f74a4a', // Blue for excitatory, red for inhibitory
          strength: (connection.weight || 0.5) * connection.direction * (isStrong ? 1.5 : 1.0), // Stronger effect on learned pathways
          isStrong: isStrong // Flag for visual effects
        };

        // Add pulse to connection
        connection.pulses.push(pulse);

        // For strong connections, sometimes trigger multiple pulses (burst firing)
        if (isStrong && Math.random() < 0.3) {
          // Add a second pulse with slight delay
          setTimeout(() => {
            if (connection.active) { // Check if connection is still active
              const burstPulse = {
                progress: 0,
                speed: 0.02,
                color: pulse.color,
                strength: pulse.strength * 0.8, // Slightly weaker
                isStrong: true
              };
              connection.pulses.push(burstPulse);
            }
          }, 100); // 100ms delay
        }
      }
    });
  }

  // Update pulses traveling along connections
  updatePulses() {
    this.connections.forEach(connection => {
      // Update existing pulses
      if (connection.pulses && connection.pulses.length > 0) {
        // Process pulses in reverse order to safely remove them
        for (let i = connection.pulses.length - 1; i >= 0; i--) {
          const pulse = connection.pulses[i];

          // Move pulse along connection
          pulse.progress += pulse.speed;

          // If pulse reaches the end
          if (pulse.progress >= 1.0) {
            // Affect target neuron
            const targetNode = this.nodes[connection.to];

            // Add energy based on pulse strength and connection strength
            const energyTransfer = Math.abs(pulse.strength) * 0.2 * (connection.strength || 1.0);
            targetNode.energy += energyTransfer;

            // Increment connection usage count for learning
            connection.usageCount = (connection.usageCount || 0) + 1;

            // Create small burst effect at target neuron
            this.createPulseArrivalEffect(targetNode);

            // Remove pulse
            connection.pulses.splice(i, 1);

            // If this was the last pulse, set connection to inactive
            if (connection.pulses.length === 0) {
              connection.active = false;
            }
          }
        }
      }
    });
  }

  // Create visual effect when a pulse arrives at a neuron
  createPulseArrivalEffect(node) {
    // Create a quick flash effect
    const flash = {
      x: node.x,
      y: node.y,
      radius: node.radius * 1.5,
      opacity: 0.7,
      color: '#ffffff',
      isFlash: true,
      duration: 10 // Frames
    };

    this.neuronFirings.push(flash);
  }

  // Helper method to get RGB values from hex color
  getColorValues(hex) {
    // Remove # if present
    hex = hex.replace('#', '');

    // Convert hex to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `${r}, ${g}, ${b}`;
  }

  // Helper method to lighten a color
  lightenColor(hex, percent) {
    // Remove # if present
    hex = hex.replace('#', '');

    // Convert hex to RGB
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // Lighten
    r = Math.min(255, Math.floor(r * (100 + percent) / 100));
    g = Math.min(255, Math.floor(g * (100 + percent) / 100));
    b = Math.min(255, Math.floor(b * (100 + percent) / 100));

    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  // Helper method to darken a color
  darkenColor(hex, percent) {
    // Remove # if present
    hex = hex.replace('#', '');

    // Convert hex to RGB
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // Darken
    r = Math.max(0, Math.floor(r * (100 - percent) / 100));
    g = Math.max(0, Math.floor(g * (100 - percent) / 100));
    b = Math.max(0, Math.floor(b * (100 - percent) / 100));

    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  // Draw electric-like spikes around firing neuron
  drawNeuronSpikes(node, time) {
    const spikeCount = 8;
    const baseLength = node.radius * 2;

    this.ctx.save();
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    this.ctx.lineWidth = 2;

    for (let i = 0; i < spikeCount; i++) {
      const angle = (i / spikeCount) * Math.PI * 2;
      const spikeLength = baseLength * (0.8 + 0.4 * Math.sin(time / 100 + i));

      // Draw jagged lightning-like spike
      this.ctx.beginPath();
      this.ctx.moveTo(
        node.x + Math.cos(angle) * node.radius,
        node.y + Math.sin(angle) * node.radius
      );

      // Create zigzag pattern
      const segments = 3;
      let prevX = node.x + Math.cos(angle) * node.radius;
      let prevY = node.y + Math.sin(angle) * node.radius;

      for (let j = 1; j <= segments; j++) {
        const segmentLength = (spikeLength / segments) * j;
        const jitter = node.radius * 0.3 * (Math.random() - 0.5);
        const perpAngle = angle + Math.PI / 2;

        const newX = node.x + Math.cos(angle) * segmentLength;
        const newY = node.y + Math.sin(angle) * segmentLength;

        // Add perpendicular jitter
        const jitterX = newX + Math.cos(perpAngle) * jitter;
        const jitterY = newY + Math.sin(perpAngle) * jitter;

        this.ctx.lineTo(jitterX, jitterY);
        prevX = jitterX;
        prevY = jitterY;
      }

      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  // Draw dendrites (small branches) for neurons
  drawDendrites(node) {
    const branchCount = Math.floor(4 + node.energy * 6); // More branches as energy increases
    const maxLength = node.radius * 1.5;

    this.ctx.save();
    this.ctx.strokeStyle = `rgba(${this.getColorValues(node.color)}, 0.4)`;
    this.ctx.lineWidth = 1;

    for (let i = 0; i < branchCount; i++) {
      const angle = (i / branchCount) * Math.PI * 2;
      const length = maxLength * (0.5 + Math.random() * 0.5);

      // Draw a branching dendrite
      this.ctx.beginPath();
      this.ctx.moveTo(
        node.x + Math.cos(angle) * node.radius,
        node.y + Math.sin(angle) * node.radius
      );

      // Main branch
      const endX = node.x + Math.cos(angle) * (node.radius + length);
      const endY = node.y + Math.sin(angle) * (node.radius + length);
      this.ctx.lineTo(endX, endY);

      // Sub branches (if energy is high enough)
      if (node.energy > 0.5) {
        const subBranches = Math.floor(Math.random() * 3) + 1;
        for (let j = 0; j < subBranches; j++) {
          const subAngle = angle + (Math.random() - 0.5) * Math.PI / 2;
          const subLength = length * 0.4 * Math.random();

          this.ctx.moveTo(endX, endY);
          this.ctx.lineTo(
            endX + Math.cos(subAngle) * subLength,
            endY + Math.sin(subAngle) * subLength
          );
        }
      }

      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  // Draw expanding rings and other effects for neuron firing
  drawNeuronFiringEffects() {
    // Process and draw neuron firing visual effects
    for (let i = this.neuronFirings.length - 1; i >= 0; i--) {
      const effect = this.neuronFirings[i];

      // Update effect properties
      effect.radius += 1.5; // Expand
      effect.opacity -= 0.02; // Fade out

      // Remove if fully faded
      if (effect.opacity <= 0) {
        this.neuronFirings.splice(i, 1);
        continue;
      }

      // Draw expanding ring
      this.ctx.beginPath();
      this.ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = `rgba(${this.getColorValues(effect.color)}, ${effect.opacity})`;
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      // Draw secondary pulse (smaller, faster)
      if (effect.opacity > 0.5) {
        this.ctx.beginPath();
        this.ctx.arc(effect.x, effect.y, effect.radius * 0.7, 0, Math.PI * 2);
        this.ctx.strokeStyle = `rgba(255, 255, 255, ${effect.opacity * 0.7})`;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
      }
    }
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
