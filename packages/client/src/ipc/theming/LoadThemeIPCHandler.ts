import { IPCConstants } from '@botvy/framework/dist/ipc/IPCConstants';
import { IPCEventHandler } from '@botvy/framework/dist/ipc/IPCEventHandler';
import { IPCResult } from '@botvy/framework/dist/ipc/IPCResult';
import { ITheme } from '@botvy/framework/dist/theming/ITheme';
import { ThemeManager } from '@botvy/framework/dist/theming/ThemeManager';
import { inject, injectable } from 'inversify';

@injectable()
export class LoadThemeIPCHandler extends IPCEventHandler<ITheme, string[]> {
    constructor(
        @inject(ThemeManager)
        private readonly themeManager: ThemeManager,
    ) {
        super(IPCConstants.Core.Theming.LoadTheme);
    }

    async handleEvent(
        event: Electron.IpcMainInvokeEvent,
        args: string[],
    ): Promise<IPCResult<ITheme>> {
        const [themeName] = args;

        try {
            return IPCResult.CreateSuccessfulResult(
                this.themeManager.loadTheme(themeName),
            );
        } catch (error) {
            return IPCResult.CreateFailedResult(error);
        }
    }
}
