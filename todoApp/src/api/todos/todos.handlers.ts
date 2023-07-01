import { NextFunction, Request, Response } from 'express'
import { TodoWithId, Todos, Todo } from "./todos.model"
import { ParamsWithId } from '../../interfaces/ParamsWIthid';
import { ObjectId } from 'mongodb';


export async function findAll(req: Request, res: Response<TodoWithId[]>, next: NextFunction) {
  try {
    const { status, search } = req.query;

    const filter: any = {};

    // Filter by status if provided
    if (status) {
      if (status === 'true' || status === 'false') {
        // Convert status string to boolean
        filter.status = status === 'true';
      }
    }

    // Search by title or description if provided
    if (search) {
      const searchRegex = new RegExp(search as string, 'i');
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex }
      ];
    }

    // Query the Todos collection with the filter
    const todos = await Todos.find(filter).toArray();

    // Return the filtered todos as JSON response
    res.json(todos);
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
}


export async function createOne(req: Request<{}, TodoWithId, Todo>, res: Response<TodoWithId>, next: NextFunction) {
  try {
    // Insert the new todo into the Todos collection
    const insertResult = await Todos.insertOne(req.body);

    // Check if the insertion was successful
    if (!insertResult.acknowledged) {
      // If insertion failed, throw an error
      throw new Error('Error inserting todo.');
    }

    // Set the response status to 201 (Created)
    res.status(201);

    // Return the created todo as JSON response, including the generated _id
    res.json({ _id: insertResult.insertedId, ...req.body });
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
}




export async function findOne(req: Request<ParamsWithId, TodoWithId, {}>, res: Response<TodoWithId>, next: NextFunction) {
  try {
    // Find a single todo in the Todos collection by the provided id
    const result = await Todos.findOne({
      _id: new ObjectId(req.params.id),
    });

    // Check if a todo was found
    if (!result) {
      // If no todo was found, set the response status to 404 (Not Found)
      res.status(404);

      // Throw an error with a descriptive message
      throw new Error(`Todo with id "${req.params.id}" not found.`);
    }

    // Return the found todo as JSON response
    res.json(result);
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
}

export async function updateOne(req: Request<ParamsWithId, TodoWithId, Todo>, res: Response<TodoWithId>, next: NextFunction) {
  try {
    // Find a single todo in the Todos collection by the provided id and update it
    const result = await Todos.findOneAndUpdate(
      {
        _id: new ObjectId(req.params.id),
      },
      {
        $set: req.body,
      },
      {
        returnDocument: 'after',
      }
    );

    // Check if a todo was found and updated
    if (!result.value) {
      // If no todo was found, set the response status to 404 (Not Found)
      res.status(404);

      // Throw an error with a descriptive message
      throw new Error(`Todo with id "${req.params.id}" not found.`);
    }

    // Return the updated todo as JSON response
    res.json(result.value);
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
}

export async function deleteOne(req: Request<ParamsWithId, {}, {}>, res: Response<{}>, next: NextFunction) {
  try {
    // Find a single todo in the Todos collection by the provided id and delete it
    const result = await Todos.findOneAndDelete({
      _id: new ObjectId(req.params.id),
    });

    // Check if a todo was found and deleted
    if (!result.value) {
      // If no todo was found, set the response status to 404 (Not Found)
      res.status(404);

      // Throw an error with a descriptive message
      throw new Error(`Todo with id "${req.params.id}" not found.`);
    }

    // Set the response status to 204 (No Content) to indicate successful deletion
    res.status(204).end();
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
}