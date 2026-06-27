/**
 * Randomisation algorithms for participant allocation.
 * Supports simple randomisation and block randomisation.
 */

/**
 * Simple 1:1 randomisation using crypto-secure random.
 */
export function simpleRandomise() {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % 2 === 0 ? 'gmi' : 'control';
}

/**
 * Block randomisation.
 * Given current counts, ensures balance within blocks.
 * @param {number} gmiCount - current GMI allocation count
 * @param {number} controlCount - current control allocation count
 * @param {number} blockSize - block size (default 4)
 */
export function blockRandomise(gmiCount, controlCount, blockSize = 4) {
  const totalInBlock = (gmiCount + controlCount) % blockSize;
  const gmiInBlock = gmiCount % (blockSize / 2);
  const controlInBlock = controlCount % (blockSize / 2);

  // If one group has filled its block quota, assign to the other
  if (gmiInBlock >= blockSize / 2) return 'control';
  if (controlInBlock >= blockSize / 2) return 'gmi';

  // Otherwise, random
  return simpleRandomise();
}
