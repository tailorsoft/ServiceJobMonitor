<div class="settingMenuItem<#if sri.screenUrlInfo.targetScreen.screenName == 'MonitorSettings'> active</#if>">
    <a class="text-inline" href="MonitorSettings?monitorId=${monitorId}">General</a>
</div>
<div class="settingMenuItem<#if sri.screenUrlInfo.targetScreen.screenName == 'MonitorSettingsBounds'> active</#if>">
    <a class="text-inline" href="MonitorSettingsBounds?monitorId=${monitorId}">Bounds</a>
</div>
<div class="settingMenuItem<#if sri.screenUrlInfo.targetScreen.screenName == 'MonitorSettingsNotification'> active</#if>">
    <a class="text-inline" href="MonitorSettingsNotification?monitorId=${monitorId}">Notification</a>
</div>