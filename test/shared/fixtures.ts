import { RubicLiFiProxy, TestToken } from '../../typechain';
import { Fixture } from 'ethereum-waffle';
import { ethers, network } from 'hardhat';
import TestTokenJSON from '../../artifacts/contracts/test/TestToken.sol/TestToken.json';
import { expect } from 'chai';

const envConfig = require('dotenv').config();
const {
    TRANSIT_POLYGON: TEST_TRANSIT,
    SWAP_TOKEN_POLYGON: TEST_SWAP,
    LIFI
} = envConfig.parsed || {};

interface SymbiosisProxyFixture {
    proxy: RubicLiFiProxy;
    transitToken: TestToken;
    swapToken: TestToken;
}

export const symbiosisProxyFixture: Fixture<SymbiosisProxyFixture> = async function (
    wallets
): Promise<SymbiosisProxyFixture> {
    const proxyFactory = await ethers.getContractFactory('RubicLiFiProxy');

    let proxy: RubicLiFiProxy;
    proxy = (await proxyFactory.deploy(0, [], [], [], [], '100000', LIFI)) as RubicLiFiProxy;

    const tokenTransitFactory = ethers.ContractFactory.fromSolidity(TestTokenJSON);
    let transitToken = tokenTransitFactory.attach(TEST_TRANSIT) as TestToken;
    transitToken = transitToken.connect(wallets[0]);

    const swapTokenFactory = ethers.ContractFactory.fromSolidity(TestTokenJSON);
    let swapToken = swapTokenFactory.attach(TEST_SWAP) as TestToken;
    swapToken = swapToken.connect(wallets[0]);

    const abiCoder = ethers.utils.defaultAbiCoder;

    const storageBalancePositionTransit = ethers.utils.keccak256(
        abiCoder.encode(['address'], [wallets[0].address]) +
            abiCoder.encode(['uint256'], [0]).slice(2, 66)
    );

    await network.provider.send('hardhat_setStorageAt', [
        TEST_TRANSIT,
        storageBalancePositionTransit,
        abiCoder.encode(['uint256'], [ethers.utils.parseEther('100000')])
    ]);

    await network.provider.send('hardhat_setStorageAt', [
        TEST_SWAP,
        storageBalancePositionTransit,
        abiCoder.encode(['uint256'], [ethers.utils.parseEther('100000')])
    ]);

    expect(await transitToken.balanceOf(wallets[0].address)).to.be.eq(
        ethers.utils.parseEther('100000')
    );

    return { proxy, transitToken, swapToken };
};
