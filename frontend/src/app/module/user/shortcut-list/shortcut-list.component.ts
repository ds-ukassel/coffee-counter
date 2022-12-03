import {Component, Input, OnInit} from '@angular/core';
import {Shortcut} from '../../../core/model/user.interface';

@Component({
  selector: 'app-shortcut-list',
  templateUrl: './shortcut-list.component.html',
  styleUrls: ['./shortcut-list.component.scss'],
})
export class ShortcutListComponent implements OnInit {
  @Input() shortcuts!: Shortcut[];

  icons = [
    '🍇',
    '🍈',
    '🍉',
    '🍊',
    '🍋',
    '🍌',
    '🍍',
    '🥭',
    '🍎',
    '🍏',
    '🍐',
    '🍑',
    '🍒',
    '🍓',
    '🫐',
    '🥝',
    '🍅',
    '🫒',
    '🥥',
    '🥑',
    '🍆',
    '🥔',
    '🥕',
    '🌽',
    '🌶',
    '🫑',
    '🥒',
    '🥬',
    '🥦',
    '🧄',
    '🧅',
    '🍄',
    '🥜',
    '🫘',
    '🌰',
    '🍞',
    '🥐',
    '🥖',
    '🫓',
    '🥨',
    '🥯',
    '🥞',
    '🧇',
    '🧀',
    '🍖',
    '🍗',
    '🥩',
    '🥓',
    '🍔',
    '🍟',
    '🍕',
    '🌭',
    '🥪',
    '🌮',
    '🌯',
    '🫔',
    '🥙',
    '🧆',
    '🥚',
    '🍳',
    '🥘',
    '🍲',
    '🫕',
    '🥣',
    '🥗',
    '🍿',
    '🧈',
    '🧂',
    '🥫',
    '🍱',
    '🍘',
    '🍙',
    '🍚',
    '🍛',
    '🍜',
    '🍝',
    '🍠',
    '🍢',
    '🍣',
    '🍤',
    '🍥',
    '🥮',
    '🍡',
    '🥟',
    '🥠',
    '🥡',
    '🦪',
    '🍦',
    '🍧',
    '🍨',
    '🍩',
    '🍪',
    '🎂',
    '🍰',
    '🧁',
    '🥧',
    '🍫',
    '🍬',
    '🍭',
    '🍮',
    '🍯',
    '🍼',
    '🥛',
    '☕',
    '🫖',
    '🍵',
    '🍶',
    '🍾',
    '🍷',
    '🍸',
    '🍹',
    '🍺',
    '🍻',
    '🥂',
    '🥃',
    '🫗',
    '🥤',
    '🧋',
    '🧃',
    '🧉',
    '🧊',
    '🥢',
    '🍽',
    '🍴',
    '🥄',
    '🫙',
  ];

  constructor() {
  }

  ngOnInit(): void {
  }

  add() {
    this.shortcuts.push({
      icon: this.icons[Math.floor(Math.random() * this.icons.length)],
      description: '',
      total: 0,
    });
  }

  remove(shortcut: Shortcut) {
    this.shortcuts.splice(this.shortcuts.indexOf(shortcut), 1);
  }
}