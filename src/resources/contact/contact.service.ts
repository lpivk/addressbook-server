import { ContactModel } from './contact.model';
import { IContact } from './contact.interface';

export class ContactService {
  public async findContactsByUserId(userId: string) {
    return await ContactModel.find({ userId });
  }

  public async findContactById(_id: string) {
    const contact = await ContactModel.findById(_id);
    if (!contact) throw new Error('Contact does not exist.');

    return contact;
  }

  public async addNewContact(contact: IContact) {
    const contactByEmail = await ContactModel.findOne({
      email: contact.email,
      userId: contact.userId,
    });
    if (contactByEmail)
      throw new Error("You've already added contact with that email.");

    const contactByPhone = await ContactModel.findOne({
      phone: contact.phone,
      userId: contact.userId,
    });
    if (contactByPhone)
      throw new Error("You've already added contact with that number.");

    const newContact = await ContactModel.create(contact);

    return newContact._id.toString();
  }

  public async editContact(_id: string, newContact: IContact) {
    const contactByEmail = await ContactModel.findOne({
      email: newContact.email,
      userId: newContact.userId,
      _id: { $ne: _id },
    });
    if (contactByEmail)
      throw new Error("You've already have contact with that email.");

    const contactByPhone = await ContactModel.findOne({
      phone: newContact.phone,
      userId: newContact.userId,
      _id: { $ne: _id },
    });
    if (contactByPhone)
      throw new Error("You've already have contact with that number.");

    await ContactModel.findByIdAndUpdate(_id, { ...newContact });
  }

  public async deleteContact(_id: string) {
    const contact = await ContactModel.findById(_id);
    if (!contact) throw new Error('Contact does not exist.');

    return await ContactModel.findOneAndRemove({ _id });
  }

  public async favoriteContact(_id: string) {
    await ContactModel.findByIdAndUpdate(_id, { isFavorite: true });
  }

  public async unfavoriteContact(_id: string) {
    await ContactModel.findByIdAndUpdate(_id, { isFavorite: false });
  }

  public async findFavoriteContactsByUserId(userId: string) {
    return await ContactModel.find({ userId, isFavorite: true });
  }
}
