import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'app-particles-background',
  template: `<div class="background-particles"></div>`,
  styleUrls: ['./particles-background.component.css']
})
export class ParticlesBackgroundComponent implements OnInit {
  constructor(private renderer: Renderer2, private el: ElementRef) { }

  ngOnInit(): void {
    const container = this.el.nativeElement.querySelector('.background-particles');

    const createParticle = () => {
      const particle = this.renderer.createElement('div');
      this.renderer.addClass(particle, 'particle');

      // Random position & drift
      particle.style.left = `${ Math.random() * 100 }vw`;
      particle.style.bottom = `0`;
      particle.style.setProperty('--drift', `${ Math.random() * 100 - 50 }`);
      particle.style.animationDuration = `${ 8 + Math.random() * 5 }s`;

      // Random size
      const size = Math.random() * 4 + 2;
      particle.style.width = `${ size }px`;
      particle.style.height = `${ size }px`;

      this.renderer.appendChild(container, particle);

      setTimeout(() => {
        this.renderer.removeChild(container, particle);
      }, 13000);
    };

    setInterval(createParticle, 300);
  }
}
