export class SingleLoadedModule {

  constructor(targetModule: any) {
    if (targetModule) {
      throw new Error(
        `Module ${targetModule.constructor.name} has already been loaded. Be sure to import it only into the root app module.`
      );
    }
  }

}
