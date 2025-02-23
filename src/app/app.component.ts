import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {CardData} from './card-data.model';
import {RestartDialogComponent} from './restart-dialog/restart-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  cardImages = {
    fruits: [
      'apple',
      'grape',
      'orange',
      'pear',
      'strawberry'
    ],
    animals: [
      'giraffe',
      'kanguru',
      'leon',
      'panda',
      'rabbit'
    ],
    transport: [
      'ambulance',
      'bus',
      'car',
      'plane',
      'tractor'
    ]
  };

  cards: CardData[] = [];

  flippedCards: CardData[] = [];

  matchedCount = 0;
  private selectedTopic: string;

  shuffleArray(anArray: any[]): any[] {
    return anArray.map(a => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map(a => a[1]);
  }

  constructor(private dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.showDialog();
  }

  setupCards(): void {
    this.cards = [];
    this.cardImages[this.selectedTopic].forEach((image) => {
      const cardData: CardData = {
        imageId: image,
        state: 'default'
      };

      this.cards.push({...cardData});
      this.cards.push({...cardData});

    });

    this.cards = this.shuffleArray(this.cards);
  }

  cardClicked(index: number): void {
    const cardInfo = this.cards[index];

    if (cardInfo.state === 'default' && this.flippedCards.length < 2) {
      cardInfo.state = 'flipped';
      this.flippedCards.push(cardInfo);

      if (this.flippedCards.length > 1) {
        this.checkForCardMatch();
      }

    } else if (cardInfo.state === 'flipped') {
      cardInfo.state = 'default';
      this.flippedCards.pop();

    }
  }

  checkForCardMatch(): void {
    setTimeout(() => {
      const cardOne = this.flippedCards[0];
      const cardTwo = this.flippedCards[1];
      const nextState = cardOne.imageId === cardTwo.imageId ? 'matched' : 'default';
      cardOne.state = cardTwo.state = nextState;

      this.flippedCards = [];

      if (nextState === 'matched') {
        this.matchedCount++;

        if (this.matchedCount === this.cardImages[this.selectedTopic].length) {
          this.showDialog();
        }
      }

    }, 1000);
  }

  restart(topic: string): void {
    this.matchedCount = 0;
    this.selectedTopic = topic;
    this.setupCards();
  }

  private showDialog() {
    const dialogRef = this.dialog.open(RestartDialogComponent, {
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((val) => {
      this.restart(val);
    });
  }
}
