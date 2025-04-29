export type MakeFileProps = {
  file: string;
  createFile?: boolean;
};

export type File = {
  read: () => Promise<string>;
  write: (data: string) => Promise<void>;
};

export async function makeFile({
  file,
  createFile,
}: MakeFileProps): Promise<File> {
  try {
    await Deno.lstat(file);
  } catch (err) {
    if (!(err instanceof Deno.errors.NotFound)) {
      throw err;
    }

    if (!createFile) {
      throw new Error(`File ${file} does not exist`);
    }

    await Deno.create(file);
  }

  return {
    read: async (): Promise<string> => {
      return await Deno.readTextFile(file);
    },
    write: async (data: string): Promise<void> => {
      await Deno.writeTextFile(file, data);
    },
  };
}
