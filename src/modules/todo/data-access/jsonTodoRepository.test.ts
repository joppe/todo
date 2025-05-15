import { beforeEach, describe, it } from "jsr:@std/testing/bdd";
import { assertEquals } from "jsr:@std/assert";
import { assertSpyCalls, spy } from "jsr:@std/testing/mock";
import { assertRejects } from "@std/assert/rejects";

import { File } from "@gateways/file.ts";

import { fakeId, fakeTodo } from "../test/fakeTodo.ts";
import { TodoRepository } from "./TodoRepository.ts";
import { makeJsonTodoRepository } from "./jsonTodoRepository.ts";

describe("jsonTodoRepository", () => {
  let file: File;
  let repository: TodoRepository;

  beforeEach(() => {
    file = (() => {
      let data = JSON.stringify([]);

      return {
        read: () => Promise.resolve(data),
        write: (_data: string) => {
          data = _data;

          return Promise.resolve();
        },
      };
    })();
    repository = makeJsonTodoRepository({
      file,
      generateId: fakeId,
    });
  });

  describe("insert", () => {
    it("returns the added todo", async () => {
      const { id: _id, ...data } = fakeTodo();

      const todo = await repository.insert(data);

      assertEquals(todo.title, data.title);
    });

    it("writes the data to the file", async () => {
      const { id: _id, ...data } = fakeTodo();
      const writeSpy = spy(file, "write");

      await repository.insert(data);

      assertSpyCalls(writeSpy, 1);
    });
  });

  describe("update", () => {
    it("returns the updated todo", async () => {
      const { id: _id, ...data } = fakeTodo();
      const todo = await repository.insert(data);

      const updatedTodo = await repository.update(todo.id, {
        title: "updated",
        description: "updated",
        deadline: new Date(),
      });

      assertEquals(updatedTodo.title, "updated");
    });
  });

  describe("remove", () => {
    it("removes the todo", async () => {
      const { id: _id, ...data } = fakeTodo();
      const todo = await repository.insert(data);

      await repository.remove(todo.id);

      const result = await repository.find(todo.id);

      assertEquals(result, null);
    });

    it("throws when todo not found", () => {
      assertRejects(
        async () => {
          await repository.remove(fakeId());
        },
        Error,
        "Todo not found",
      );
    });
  });

  describe("find", () => {
    it("returns the todo", async () => {
      const { id: _id, ...data } = fakeTodo();
      const todo = await repository.insert(data);

      const foundTodo = await repository.find(todo.id);

      assertEquals(foundTodo?.title, data.title);
    });

    it("return null if the todo is not found", async () => {
      const result = await repository.find(fakeId());

      assertEquals(result, null);
    });
  });

  describe("findAll", () => {
    it("sorted", async () => {
      await repository.insert(fakeTodo({ title: "e" }));
      await repository.insert(fakeTodo({ title: "d" }));
      await repository.insert(fakeTodo({ title: "c" }));
      await repository.insert(fakeTodo({ title: "b" }));
      await repository.insert(fakeTodo({ title: "a" }));

      const result = await repository.findAll("title", "asc");

      assertEquals(result.length, 5);
      assertEquals(result[0].title, "a");
      assertEquals(result[1].title, "b");
      assertEquals(result[2].title, "c");
      assertEquals(result[3].title, "d");
      assertEquals(result[4].title, "e");
    });
  });

  describe("toggle", () => {
    it("toggles the todo", async () => {
      const { id: _id, ...data } = fakeTodo();
      const todo = await repository.insert(data);

      const toggledTodo = await repository.toggle(todo.id);

      assertEquals(toggledTodo.done, !todo.done);
    });
  });
});
