import List from './ListModel';

const ListController = () => ({
  getList: (parent, args) => {
    try {
      return args.id ? List.findById(args.id) : List.findOne({ name: args.name });
    } catch (error) {
      throw new Error(`List with id ${args.id} could not be retrieved`);
    }
  },
  getLists: async () => {
    try {
      return await List.find({});
    } catch (error) {
      throw new Error('Lists could not be retrieved');
    }
  },
  addList: async (parent, args) => {
    try {
      const { stream, filename, mimetype, encoding } = await args.input.file;

      console.log("args.input", args.input);
      console.log("stream", stream);
      console.log("filename", filename);
      console.log("encoding", encoding);
      console.log("mimetype", mimetype);

      //const newList = List.create(args.input);
      return { message: `New List created with id ${newList.id}` };
    } catch (error) {
      throw new Error('List could not be added');
    }
  },
  updateList: async (parent, args) => {
    try {
      return await List
        .findByIdAndUpdate(args.id, { $set: args.input }, { new: true })
    } catch (error) {
      throw new Error('List could not be updated');
    }
  },
  removeList: async (parent, args) => {
    try {
      return await List.findOneAndRemove({ _id: args.id });
    } catch (error) {
      throw new Error('List could not be updated');
    }
  }
});

export default ListController;
