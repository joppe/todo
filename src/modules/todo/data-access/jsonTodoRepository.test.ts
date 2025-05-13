import { beforeEach, describe, it } from "jsr:@std/testing/bdd";
import { assertEquals } from "jsr:@std/assert";
import { assertSpyCalls, spy } from "jsr:@std/testing/mock";

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

  describe("findAll", () => {
    it("returns all todos sorted by title ascending", async () => {
      await repository.insert(fakeTodo({ title: "e" }));
      await repository.insert(fakeTodo({ title: "d" }));
      await repository.insert(fakeTodo({ title: "c" }));
      await repository.insert(fakeTodo({ title: "b" }));
      await repository.insert(fakeTodo({ title: "a" }));

      const result = await repository.findAll({
        sort: "title",
        direction: "asc",
      });

      assertEquals(result.length, 5);
      assertEquals(result[0].title, "a");
      assertEquals(result[1].title, "b");
      assertEquals(result[2].title, "c");
      assertEquals(result[3].title, "d");
      assertEquals(result[4].title, "e");
    });
  });
});
