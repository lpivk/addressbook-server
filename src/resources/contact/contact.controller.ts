import { Router, RequestHandler } from 'express';
import { IController } from '../../utils/types/IController';
import { ContactService } from './contact.service';
import { IContact } from './contact.interface';

export default class ContactController implements IController {
  public path = '/contacts';
  public router = Router();
  private ContactService = new ContactService();

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.get(`${this.path}/`, this.getContactsByUserId);
    this.router.get(`${this.path}/:id`, this.getContactById);
    this.router.post(`${this.path}/`, this.addNewContact);
    this.router.delete(`${this.path}/:id`, this.deleteContact);
    this.router.post(`${this.path}/favorite/:id`, this.favoriteContact);
    this.router.post(`${this.path}/unfavorite/:id`, this.unfavoriteContact);
    this.router.post(`${this.path}/edit/:id`, this.editContact);
    this.router.get(
      `${this.path}/favorites/:userId`,
      this.getFavoriteContactsByUserId
    );
  }

  private getContactsByUserId: RequestHandler = async (req, res) => {
    try {
      const userId = req.query.userId as string;

      const contacts = await this.ContactService.findContactsByUserId(userId);

      res.status(200).json(contacts);
    } catch (error) {
      const err = error as Error;

      res.status(400).json({ message: err.message });
    }
  };

  private getContactById: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;

      const contact = await this.ContactService.findContactById(id);

      res.status(200).json(contact);
    } catch (error) {
      const err = error as Error;

      res.status(400).json({ message: err.message });
    }
  };

  private addNewContact: RequestHandler = async (req, res) => {
    try {
      const contact: IContact = req.body;

      const newContactId = await this.ContactService.addNewContact(contact);

      res.status(201).json({
        id: newContactId,
      });
    } catch (error) {
      const err = error as Error;

      res.status(400).json({ message: err.message });
    }
  };

  private editContact: RequestHandler = async (req, res) => {
    try {
      const contact: IContact = req.body;
      const { id } = req.params;

      await this.ContactService.editContact(id, contact);

      res.status(200).json({ message: 'Contact edited successfully.' });
    } catch (error) {
      const err = error as Error;

      res.status(400).json({ message: err.message });
    }
  };

  private deleteContact: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;

      await this.ContactService.deleteContact(id);

      res.status(200).json({ message: 'Contact deleted successfully.' });
    } catch (error) {
      const err = error as Error;

      res.status(400).json({ message: err.message });
    }
  };

  private favoriteContact: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;

      await this.ContactService.favoriteContact(id);

      res.status(200).json({ message: 'Contact favorited successfully.' });
    } catch (error) {
      const err = error as Error;

      res.status(400).json({ message: err.message });
    }
  };

  private unfavoriteContact: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;

      await this.ContactService.unfavoriteContact(id);

      res.status(200).json({ message: 'Contact unfavorited successfully.' });
    } catch (error) {
      const err = error as Error;

      res.status(400).json({ message: err.message });
    }
  };

  private getFavoriteContactsByUserId: RequestHandler = async (req, res) => {
    try {
      const { userId } = req.params;

      const favoriteContacts =
        await this.ContactService.findFavoriteContactsByUserId(userId);

      res.status(200).json(favoriteContacts);
    } catch (error) {
      const err = error as Error;

      res.status(400).json({ message: err.message });
    }
  };
}
