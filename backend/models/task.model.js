import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description:{
    type:String,
    required:true

  } ,
  dueDate: Date,
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending',
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
 
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);
export default Task;