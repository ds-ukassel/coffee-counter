import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[appClickPulseAnimation]',
  standalone: false,
})
export class PulseDirective {
  private readonly keyframes: Keyframe[] = [
    // (255, 215, 0) is RGB for the html 'gold' color
    {boxShadow: '0 0 0 0 rgba(255, 215, 0, 1)'},
    {boxShadow: '0 0 5px 100px rgba(255, 215, 0, 0)'}
  ];
  private readonly options: KeyframeAnimationOptions = {
    duration: 700,
  }

  constructor(private el: ElementRef) {
  }

  @HostListener('click', ['$event.target'])
  restartAnimation() {
    this.el.nativeElement.animate(this.keyframes, this.options);
  }
}
