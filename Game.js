const gameState = {};

class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    preload() {
        this.load.image('racket', './images/racket.png')
    }

    create() {
        gameState.logo = this.add.image(70, 0, 'racket').setOrigin(0).setScale(0.8);
        this.add.text(200, 450, 'Click to start!', {
            fontSize: 48, color: '#000000'
        });

        this.input.on('pointerup', () => {
            this.scene.stop('StartScene');
            this.scene.start('GameScene');
        });
    }
}

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.image('bg', "./images/bg.png")
        this.load.image('ball', "./images/ball.png")
        this.load.image('rect', './images/rect.png')
    }

    create() {
        gameState.playerScore1 = 0
        gameState.playerScore2 = 0
        gameState.speed = 300
        gameState.bg = this.add.image(0, 0, 'bg').setOrigin(0);
        gameState.ball = this.physics.add.sprite(412, 275, 'ball').setVelocity(400, 400).setScale(0.5);
        gameState.ball.setCollideWorldBounds(true);
        gameState.player1 = this.physics.add.sprite(0, 175, 'rect').setOrigin(0).setCollideWorldBounds(true)
        gameState.ball.setBounce(1)
        gameState.player1.setBounce(1)
        this.physics.add.collider(gameState.ball, gameState.player1)
        gameState.cursors = this.input.keyboard.createCursorKeys()
        gameState.keys = {}
        gameState.keys.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        gameState.keys.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        gameState.player2 = this.physics.add.sprite(785, 175, 'rect').setOrigin(0).setCollideWorldBounds(true)
        gameState.player2.setBounce(1)
        this.physics.add.collider(gameState.ball, gameState.player2)
        gameState.score = this.add.text(345, 0, `${gameState.playerScore1} : ${gameState.playerScore2}`, {
            fontSize: '46px' , fill: '#C0C0C0'
        })
        
    }

    update() {
        if(gameState.cursors.up.isDown) {
            gameState.player2.setVelocityY(-gameState.speed)
        }
        else if(gameState.cursors.down.isDown) {
            gameState.player2.setVelocityY(gameState.speed)
        }
        else {
            gameState.player2.setVelocityY(0)
        };

        if(gameState.keys.W.isDown) {
            gameState.player1.setVelocityY(-gameState.speed)
        }
        else if(gameState.keys.S.isDown) {
            gameState.player1.setVelocityY(gameState.speed)
        }
        else {
            gameState.player1.setVelocityY(0)
        };

        if(gameState.ball.x > 800) {
            gameState.ball.x = 412
            gameState.ball.y = 275
            gameState.playerScore1++
            gameState.score.setText(`${gameState.playerScore1} : ${gameState.playerScore2}`)
        }
        
        if(gameState.ball.x < 25) {
            gameState.ball.x = 412
            gameState.ball.y = 275
            gameState.playerScore2++
            gameState.score.setText(`${gameState.playerScore1} : ${gameState.playerScore2}`)
        }
        if(gameState.playerScore1 >= 5 || gameState.playerScore2 >= 5) {
            gameState.speed = 500
        }
        if(gameState.playerScore1 >= 10) {
            gameState.player1.endText = 'German is Winner!!'
            gameState.player2.endText = 'Papa is Looser!!'
            this.scene.stop('GameScene')
            this.scene.start('EndScene')
        }
        if(gameState.playerScore2 >= 10) {
            gameState.player1.endText = 'German is Looser!!'
            gameState.player2.endText = 'Papa is Winner!!'
            this.scene.stop('GameScene')
            this.scene.start('EndScene')
        }
    };
}

class EndScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EndScene' });
    }
    create() {
        this.add.text(125, 183, gameState.player1.endText, {
            fontSize: '56px', fill: '#000000'
        })
        this.add.text(125, 366, gameState.player2.endText, {
            fontSize: '56px', fill: '#000000'
        })
    }

    update() {
        this.input.on('pointerup', () => {
            this.scene.stop('EndScene');
            this.scene.start('GameScene');
        });
    }
}
const config = {
    type: Phaser.AUTO,
    width: 825,
    height: 550,
    backgroundColor: "#ff4500",
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 },
            enableBody: true,
        },
    },
    scene: [StartScene, GameScene, EndScene],
};

const game = new Phaser.Game(config);