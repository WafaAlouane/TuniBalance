import { WebSocketGateway, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OnEvent } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway( { // Port séparé pour les WebSockets
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    },
    
    allowEIO3: true, // Compatibilité Node 18
    transports: ['websocket']
  })
  export class MessagesGateway implements OnGatewayInit {
    @WebSocketServer()
    server: Server;

 
  constructor(
    private  eventEmitter: EventEmitter2,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('jwt.secret')
      });
      client.join(payload.sub); // Rejoindre la room utilisateur
    } catch (err) {
      client.disconnect();
    }
  }
  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  private setupEventForwarding() {
    // Écoute tous les événements du système
    this.eventEmitter.onAny((eventName, ...args) => {
      console.log(`Event received: ${eventName}`, args);
      
      // Forward des événements spécifiques
      switch(eventName) {
        case 'private-message:new':
          this.handleNewMessage(args[0]);
          break;
        case 'private-message:updated':
          this.handleUpdatedMessage(args[0]);
          break;
        case 'private-message:deleted':
          this.handleDeletedMessage(args[0]);
          break;
      }
    });
  }

  private handleNewMessage(message: any) {
    this.server.to(message.sender._id.toString()).emit('private-message:new', message);
  this.server.to(message.recipient._id.toString()).emit('private-message:new', message);
  }

  private handleUpdatedMessage(update: { messageId: string; content: string }) {
    // Diffusion aux rooms concernées
    this.server.emit('private-message:updated', update);
  }

  private handleDeletedMessage(messageId: string) {
    this.server.emit('private-message:deleted', messageId);
  }
}