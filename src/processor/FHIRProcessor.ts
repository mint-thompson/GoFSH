import fs from 'fs-extra';
import { fhirdefs } from 'fsh-sushi';
import { logger } from '../utils';
import { ProfileProcessor } from './ProfileProcessor';
import { ExtensionProcessor } from './ExtensionProcessor';
import { CodeSystemProcessor } from './CodeSystemProcessor';

export class FHIRProcessor {
  public readonly structureDefinitions: any[] = [];
  public readonly fhir: fhirdefs.FHIRDefinitions;

  constructor(fhir: fhirdefs.FHIRDefinitions) {
    this.fhir = fhir;
  }

  process(inputPath: string) {
    const rawContent = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

    if (rawContent['resourceType'] === 'StructureDefinition') {
      // Profiles and Extensions are both made from StructureDefinitions
      this.structureDefinitions.push(rawContent);
      if (rawContent.type === 'Extension') {
        logger.debug(`Processing contents of ${inputPath} as Extension.`);
        return ExtensionProcessor.process(rawContent, this.fhir);
      } else {
        logger.debug(`Processing contents of ${inputPath} as Profile.`);
        return ProfileProcessor.process(rawContent, this.fhir);
      }
    } else if (rawContent['resourceType'] === 'CodeSystem') {
      logger.debug(`Processing contents of ${inputPath} as CodeSystem.`);
      return CodeSystemProcessor.process(rawContent);
    }
  }
}
